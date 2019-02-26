using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace WindowsBootInfo
{
    public class ServiceLogItem
    {
        [JsonConverter(typeof(StringEnumConverter))]
        public LogMessageKind Type { get; set; }

        public long RecordNumber { get; set; }

        public long EventCode { get; set; }

        public string Message { get; set; }

        public DateTime TimeGenerated { get; set; }

        public string ServiceKey { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public ServiceActionKind Action { get; set; }
    }

    public enum ServiceActionKind
    {
        NotApplicable = -1,
        Boot = 42,
        ServiceStarted = 4,
        ServiceStopped = 1,
        ServiceFailed = 43,
        ServiceCrashed = 44,
    }

    public enum LogMessageKind
    {
        Wha = 0,
        Information,
        Warning,
        Error,
        Critical
    }
}
