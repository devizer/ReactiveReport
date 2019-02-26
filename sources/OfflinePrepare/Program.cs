using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WindowsBootAnalyzer.WmiReader;
using WindowsBootInfo;

namespace OfflinePrepare
{
    class Program
    {
        static void Main(string[] args)
        {
            SimpleJsonReportWriter.Write();

            WmiMetadataReport metadataBuilder = new WmiMetadataReport();
            metadataBuilder.Run();

        }
    }
}
