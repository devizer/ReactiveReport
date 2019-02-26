using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Management;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace WindowsBootInfo
{
    class ServiceLogsReader
    {
        public Dictionary<string,string> CachedServices { get; } 

        public ServiceLogsReader()
        {
            CachedServices = new Dictionary<string, string>(StringComparer.InvariantCultureIgnoreCase);
        }

        public List<ServiceLogItem> ReadServiceControlManagerLogs()
        {
            var asDynamic = ReadServiceControlManagerLogsRaw();
            return ReadServiceControlManagerLogs(asDynamic);
        }

        internal List<ServiceLogItem> ReadServiceControlManagerLogs(List<dynamic> dynamicCopy)
        {
            return dynamicCopy.Select(AsStatic).ToList();
        }

        static string NormalizeCrLf(string message)
        {
            if (message == null) return null;
            var ret = message
                .Replace(Environment.NewLine, " ")
                .Replace("\r", " ")
                .Replace("\n", " ");

            while (ret.IndexOf("  ") > 0) ret = ret.Replace("  ", " ");
            return ret;
        }

        private ServiceLogItem AsStatic(dynamic x)
        {
            var pars = (string[])x.Parameteters;
            var ret = new ServiceLogItem()
            {
                EventCode = x.EventCode,
                Message = NormalizeCrLf(x.Message),
                RecordNumber = x.RecordNumber,
                ServiceKey = pars?.FirstOrDefault(),
                TimeGenerated = x.TimeGenerated,
                Type = ParseMessageKind(x.Type),
                Action = ServiceActionKind.NotApplicable,
            };

            var eventCode = x.EventCode;
            if (eventCode == 12)
            {
                if (ret.Message != null && ret.Message.IndexOf("The operating system started at", StringComparison.InvariantCultureIgnoreCase) >= 0)
                    ret.Action = ServiceActionKind.Boot;
            }

            else if (eventCode == 7036)
            {
                if (pars != null && pars.Length == 2)
                    ret.Action = pars[1] == "4" ? ServiceActionKind.ServiceStarted : ServiceActionKind.ServiceStopped;
            }

            else if (eventCode == 7000)
            {
                // fail with reason in the message
                ret.Action = ServiceActionKind.ServiceFailed;
            }

            else if (eventCode == 7009)
            {
                // start timeout
                ret.Action = ServiceActionKind.ServiceFailed;
            }

            else if (eventCode == 7031)
            {
                ret.Action = ServiceActionKind.ServiceCrashed;
            }

            UpdateServiceKey(ret.ServiceKey);
            return ret;
        }



        static LogMessageKind ParseMessageKind(string raw)
        {
            return Enum.TryParse<LogMessageKind>(raw, out var ret) ? ret : LogMessageKind.Wha;
        }

        internal List<dynamic> ReadServiceControlManagerLogsRaw()
        {
            List<dynamic> ret = new List<dynamic>();
            string query = $"Select * From Win32_NTLogEvent WHERE LogFile='System' And (EventCode=12 Or EventCode=7009 or EventCode=7000 or EventCode=7036 or EventCode=7031)";
            int n = 0;
            using (ManagementObjectSearcher managementObjectSearcher = new ManagementObjectSearcher(query))
            {
                foreach (ManagementBaseObject wmiRow in managementObjectSearcher.Get())
                {
                    var message = Convert.ToString(wmiRow["Message"]);
                    var code = Convert.ToInt64(wmiRow["EventCode"]);
                    var timeGenerated = Convert.ToString(wmiRow["TimeGenerated"]);
                    var data = wmiRow["Data"];
                    var dataType = data?.GetType().ToString() ?? "null";
                    var bytes = data == null ? "<null>" : string.Join(",", ((Byte[]) data).Select(x => x));
                    var type = wmiRow["Type"];
                    var recordNumber = Convert.ToInt64(wmiRow["RecordNumber"]);

                    WmiUtils.TryParseWmiDateTime(timeGenerated, out var dateTime);

                    ret.Add(new
                    {
                        Type = type,
                        RecordNumber = recordNumber,
                        EventCode = code,
                        Message = message,
                        TimeGeneratedRaw = timeGenerated,
                        TimeGenerated = dateTime,
                        DataType = dataType,
                        Data = data,
                        DataAsBytes = bytes,
                        DataAsAscii = AsAscII((byte[]) data),
                        Parameteters = ParseParameters((byte[])data)
                    });

                    if (n++ % 100 == 0) Console.Write(".");
                }
            }

            ret = ret.OrderByDescending(x => (long)x.RecordNumber).ToList();
            return ret;
        }

        static string[] ParseParameters(byte[] data)
        {
            var ascii = AsAscII(data);
            if (ascii == null) return new string[0];
            return ascii.TrimEnd((char) 0).Split('/');
        }

        static string AsAscII(byte[] arg)
        {
            if (arg == null) return null;
            StringBuilder ret = new StringBuilder();
            for (int i = 0; i < arg.Length; i += 2)
            {
                int ch = arg[i] + 256 * arg[i + 1];
                ret.Append((char) ch);
            }

            return ret.ToString();
        }

        void UpdateServiceKey(string serviceKey)
        {
            if (string.IsNullOrEmpty(serviceKey)) return;
            ServiceController sc = new ServiceController(serviceKey);
            if (CachedServices.ContainsKey(serviceKey)) return;
            try
            {
                CachedServices[serviceKey] = sc.DisplayName;
            }
            catch (Exception)
            {
                CachedServices[serviceKey] = null;
            }

        }
    }
}
