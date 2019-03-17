using System;
using Microsoft.Win32;

namespace WindowsBootAnalyzer.WmiReader
{
    public class ServicesPipeTimeoutReader
    {
        // Zero - Undefined (30000 milliseconds)
        public static int? Get()
        {
            using (var reg = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control", false))
            {
                if (reg != null)
                {
                    var raw = reg.GetValue("ServicesPipeTimeout");
                    if (raw != null)
                        return Convert.ToInt32(raw);
                }

                return null;
            }
        }
    }
}