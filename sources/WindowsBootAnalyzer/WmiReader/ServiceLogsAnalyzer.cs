using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Reflection;

namespace WindowsBootInfo
{
    public class ServiceLogsAnalyzer
    {
        public Dictionary<string, string> CachedServices { get; }

        public List<ServiceLogItem> LogItems { get; }

        public ServiceLogsAnalyzer(Dictionary<string, string> cachedServices, List<ServiceLogItem> logItems)
        {
            CachedServices = cachedServices;
            LogItems = logItems;
        }

        public dynamic BuildReport()
        {
            // time is descending
            List<ServiceLogItem> bootBuffer = new List<ServiceLogItem>();
            List<dynamic> boots = new List<dynamic>();
            foreach (var item in LogItems)
            {
                if (item.Action == ServiceActionKind.Boot)
                {
                    dynamic nextBoot = AnalyzeABoot(item.TimeGenerated, bootBuffer);
                    boots.Add(nextBoot);
                    bootBuffer.Clear();
                }
                else
                {
                    bootBuffer.Add(item);
                }
            }

            return boots;
        }

        private dynamic AnalyzeABoot(DateTime bootAt, List<ServiceLogItem> bootBuffer)
        {
            dynamic ret = new ExpandoObject();
            ret.BootAt = bootAt;
            ret.Crash = 0;
            ret.Fail = 0;
            ret.Success = 0;
            ret.Events = new List<dynamic>();

            List<ServiceLogItem> copy = new List<ServiceLogItem>(bootBuffer);
            copy.Reverse();
            Dictionary<string,DateTime?> state = new Dictionary<string, DateTime?>();
            foreach (var item in copy)
            {
                if (!(item.Action == ServiceActionKind.ServiceCrashed
                      || item.Action == ServiceActionKind.ServiceStarted
                      || item.Action == ServiceActionKind.ServiceFailed)) continue;

                var projected = new
                {
                    At = (item.TimeGenerated - bootAt).TotalSeconds,
                    Action = item.Action.ToString(),
                    item.Message,
                    item.TimeGenerated,
                    item.ServiceKey,
                    ServiceName = CachedServices[item.ServiceKey],
                    item.EventCode,
                    Type = item.Type.ToString(),
                };
                if (item.Action == ServiceActionKind.ServiceCrashed) ret.Crash = ret.Crash + 1;
                if (item.Action == ServiceActionKind.ServiceStarted) ret.Success = ret.Success + 1;
                if (item.Action == ServiceActionKind.ServiceFailed) ret.Fail = ret.Fail + 1;
                ret.Events.Add(projected);
                state[item.ServiceKey] = null;
            }

            return ret;
        }
    }
}