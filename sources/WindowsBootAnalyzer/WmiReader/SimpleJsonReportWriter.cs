using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WindowsBootInfo
{
    class SimpleJsonReportWriter
    {
        public static void Write()
        {
            Stopwatch sw = Stopwatch.StartNew();
            // Raw
            var logsReader = new ServiceLogsReader();
            List<dynamic> asDynamic = logsReader.ReadServiceControlManagerLogsRaw();
            LoggingUtils.DumpTextFile(asDynamic.AsJsonString(), "System-Filtered-Log-Dynamic.json");

            // Static
            var asStatic = logsReader.ReadServiceControlManagerLogs(asDynamic);
            var dump = new
            {
                Logs = asStatic,
                Services = logsReader.CachedServices,
            };
            LoggingUtils.DumpTextFile(dump.AsJsonString(), "System-Filtered-Log.json");

            // Grouped 
            ServiceLogsAnalyzer a = new ServiceLogsAnalyzer(logsReader.CachedServices, asStatic);
            dynamic boots = a.BuildReport();
            LoggingUtils.DumpTextFile(((object)boots).AsJsonString(), "Grouped-by-Boots.json");


            var finalReport = new
            {
                Processor = WmiUtils.FetchFromQuery("Select * From Win32_Processor"),
                OS = WmiUtils.FetchFromQuery("Select * From Win32_OperatingSystem"),
                // Status is OK?
                ComputerSystem = WmiUtils.FetchFromQuery("Select * From Win32_ComputerSystem"),
                Boots = boots,
            };

            LoggingUtils.DumpTextFile(((object)finalReport).AsJsonString(), "Final-Report.json");
            LoggingUtils.DumpTextFile(((object)finalReport).AsJsonString(false), "Final-Report.min.json");

            Console.WriteLine($" Done: {sw.Elapsed}");

        }
    }
}
