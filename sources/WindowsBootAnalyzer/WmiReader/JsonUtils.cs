using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace WindowsBootInfo
{
    public static class LoggingUtils
    {
        public static string AsJsonString(this object anObject, bool formatted = true)
        {
            JsonSerializer ser = new JsonSerializer()
            {
                Formatting = formatted ? Formatting.Indented : Formatting.None,
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
            };

            StringBuilder json = new StringBuilder();
            StringWriter jwr = new StringWriter(json);
            ser.Serialize(jwr, anObject);
            jwr.Flush();

            return json.ToString();

            // string json = JsonConvert.SerializeObject(anObject, Formatting.Indented, settings);
        }

        public static void DumpTextFile(IConvertible content, string fileName)
        {
            var asString = content.ToString(CultureInfo.CurrentCulture);
            using (FileStream fs = new FileStream(fileName, FileMode.Create, FileAccess.Write, FileShare.ReadWrite))
            using (StreamWriter wr = new StreamWriter(fs, new UTF8Encoding(false)))
            {
                wr.Write(asString);
            }

        }
    }
}
