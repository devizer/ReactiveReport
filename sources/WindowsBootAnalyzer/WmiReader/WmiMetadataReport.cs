using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Management;
using System.Threading.Tasks;
using WindowsBootInfo;

namespace WindowsBootAnalyzer.WmiReader
{
    public class WmiMetadataReport
    {
        private const string DirName = "Wmi-Metadata-Report";

        public void Run()
        {
            CleanUp();

            var classNames = GetClassNames().OrderBy(ClassOrderExpression).ToArray();

            var index = 0;
            Parallel.ForEach(classNames, new ParallelOptions() {MaxDegreeOfParallelism = 6}, className =>
            {
                dynamic classReport = BuildClassReport(className, $"Select * From {className}");
                bool isOk = classReport.ExceptionInfo == null;

                WriteClassReport(className, classReport);

                Console.WriteLine($"[{++index} of {classNames.Length}] {className}: {(isOk ? "OK" : classReport.ExceptionInfo)}");
            });

        }

        static string ClassOrderExpression(string name)
        {
            if (name.StartsWith("CIM_", StringComparison.InvariantCultureIgnoreCase)) return name.Substring(4) + "-CIM";
            if (name.StartsWith("Win32_", StringComparison.InvariantCultureIgnoreCase)) return name.Substring(6) + "-WIN32";
            return name;

        }

        void CleanUp()
        {
            try
            {
                Directory.CreateDirectory(DirName);
            }
            catch
            {
            }
        }


        private void WriteClassReport(string className, dynamic classReport)
        {
            var json = ((object)classReport).AsJsonString(true);
            LoggingUtils.DumpTextFile(json, Path.Combine(DirName, className + ".json"));
        }

        private string[] GetClassNames()
        {
            using (ManagementObjectSearcher managementObjectSearcher = new ManagementObjectSearcher("Select * From meta_class"))
            {
                List<string> ret = new List<string>();
                foreach (ManagementBaseObject wmiRow in managementObjectSearcher.Get())
                {
                    ret.Add(Convert.ToString(wmiRow.SystemProperties["__Class"].Value));
                }

                return ret.Where(x => !string.IsNullOrEmpty(x)).ToArray();
            }
        }

        private dynamic BuildClassReport(dynamic className, string query)
        {
            Stopwatch sw = Stopwatch.StartNew();
            try
            {
                using (ManagementObjectSearcher managementObjectSearcher = new ManagementObjectSearcher(query))
                {
                    List<dynamic> properties = new List<dynamic>();
                    dynamic firstRow = new ExpandoObject();
                    foreach (ManagementBaseObject wmiRow in managementObjectSearcher.Get())
                    {
                        var propertyDataCollection = wmiRow.Properties;
                        foreach (PropertyData property in propertyDataCollection)
                        {
                            object propertyValue;
                            WmiUtils.TryGetProperty(wmiRow, property.Name, out propertyValue);
                            ((IDictionary<string, object>) firstRow)[property.Name] = propertyValue;

                            properties.Add(new
                            {
                                property.Name,
                                property.Type,
                                TypeName = ((System.Management.CimType) property.Type).ToString(),
                                property.IsArray,
                                property.IsLocal,
                                property.Origin,
                                FirstValue = propertyValue,
                            });
                        }

                        break;
                    }

                    return new
                    {
                        ClassName = className,
                        Duration = sw.ElapsedMilliseconds.ToString("n0"),
                        Properties = properties,
                        Exception = (string) null,
                        ExceptionInfo = (string) null,
                    };
                }
            }
            catch (Exception ex)
            {
                return new
                {
                    ClassName = className,
                    Duration = sw.ElapsedMilliseconds.ToString("n0"),
                    Exception = ex.ToString(),
                    ExceptionInfo = GetExeptionDigest(ex),
                };

            }
        }

        public static string GetExeptionDigest(Exception ex)
        {
            List<string> ret = new List<string>();
            while (ex != null)
            {
                ret.Add("[" + ex.GetType().Name + "] " + ex.Message);
                ex = ex.InnerException;
            }

            return string.Join(" --> ", ret);
        }

    }


}
