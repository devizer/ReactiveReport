using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Dynamic;
using System.Management;

namespace WindowsBootInfo
{
    internal class WmiUtils
    {

        internal static dynamic[] FetchFromQuery(string wql, string[] fieldsByPriority = null)
        {

            List<dynamic> ret = new List<dynamic>();

            Stopwatch stopwatch = Stopwatch.StartNew();
            DataTable dataTable = new DataTable("WMI");
            int rowIndex = 0;
            using (ManagementObjectSearcher managementObjectSearcher = new ManagementObjectSearcher(wql))
            {
                string[] propertyNames = null;
                foreach (ManagementBaseObject wmiRow in managementObjectSearcher.Get())
                {
                    dynamic row = new ExpandoObject();
                    if (rowIndex == 0)
                    {
                        // Properties of the First Row.
                        propertyNames = new string[wmiRow.Properties.Count];
                        int propertyIndex = 0;
                        foreach (PropertyData property in wmiRow.Properties)
                            propertyNames[propertyIndex++] = property.Name;

                        ComparerByPriority comparerByPriority = new WmiUtils.ComparerByPriority(fieldsByPriority ?? new string[0], propertyNames);
                        Array.Sort(propertyNames, comparerByPriority);
                    }

                    foreach (string propertyName in propertyNames)
                    {
                        object propertyValue;
                        if (TryGetProperty(wmiRow, propertyName, out propertyValue))
                        {
                            ((IDictionary<string, Object>) row)[propertyName] = propertyValue;
                        }
                    }

                    ret.Add(row);
                    ++rowIndex;
                }
            }

            Debug.WriteLine("Scan WMI list '" + wql + "' by " + stopwatch.ElapsedMilliseconds.ToString("n0") + " msec");
            return ret.ToArray();
        }

        internal static bool TryParseWmiDate(string dmtfDate, out DateTime value)
        {
            try
            {
                if (dmtfDate.Length != 8)
                {
                    if (dmtfDate.Length > 9)
                    {
                        if (dmtfDate[8] != '.')
                            goto label_5;
                    }
                    else
                        goto label_5;
                }
                value = new DateTime(Int32.Parse(dmtfDate.Substring(0, 4)), Int32.Parse(dmtfDate.Substring(4, 2)), Int32.Parse(dmtfDate.Substring(6, 2)));
                return true;
            }
            catch
            {
            }

            label_5:
            try
            {
                bool wmiDateTime = WmiUtils.TryParseWmiDateTime(dmtfDate, out value);
                value = new DateTime(value.Year, value.Month, value.Day);
                return wmiDateTime;
            }
            catch
            {
            }
            value = DateTime.MinValue;
            return false;
        }

        internal static bool TryParseWmiDateTime(string dmtfDate, out DateTime value)
        {
            try
            {
                value = ToDateTime(dmtfDate);
                return true;
            }
            catch (ArgumentException ex)
            {
                value = DateTime.MinValue;
                return false;
            }
        }

        internal static DateTime ToDateTime(string dmtfDate)
        {
            DateTime minValue = DateTime.MinValue;
            int year = minValue.Year;
            int month = minValue.Month;
            int day = minValue.Day;
            int hour = minValue.Hour;
            int minute = minValue.Minute;
            int second = minValue.Second;
            long num1 = 0;
            string str = dmtfDate;
            DateTime dateTime = DateTime.MinValue;
            string empty = String.Empty;
            if (str == null)
                throw new ArgumentOutOfRangeException();
            if (str.Length == 0)
                throw new ArgumentOutOfRangeException();
            if (str.Length != 25)
                throw new ArgumentOutOfRangeException();
            try
            {
                string s1 = str.Substring(0, 4);
                if ("****" != s1)
                    year = Int32.Parse(s1);
                string s2 = str.Substring(4, 2);
                if ("**" != s2)
                    month = Int32.Parse(s2);
                string s3 = str.Substring(6, 2);
                if ("**" != s3)
                    day = Int32.Parse(s3);
                string s4 = str.Substring(8, 2);
                if ("**" != s4)
                    hour = Int32.Parse(s4);
                string s5 = str.Substring(10, 2);
                if ("**" != s5)
                    minute = Int32.Parse(s5);
                string s6 = str.Substring(12, 2);
                if ("**" != s6)
                    second = Int32.Parse(s6);
                string s7 = str.Substring(15, 6);
                if ("******" != s7)
                    num1 = Int64.Parse(s7) * 10L;
                if (year >= 0 && month >= 0 && (day >= 0 && hour >= 0) && (minute >= 0 && minute >= 0 && second >= 0))
                {
                    if (num1 >= 0L)
                        goto label_24;
                }
                throw new ArgumentOutOfRangeException();
            }
            catch (Exception ex)
            {
                throw new ArgumentOutOfRangeException((string)null, ex.Message);
            }

        label_24:
            dateTime = new DateTime(year, month, day, hour, minute, second, 0);
            DateTime time = dateTime.AddTicks(num1);
            long num2 = TimeZone.CurrentTimeZone.GetUtcOffset(time).Ticks / 600000000L;
            if (str.Substring(22, 3) != "******")
            {
                string s = str.Substring(21, 4);
                int num3;
                try
                {
                    num3 = Int32.Parse(s);
                }
                catch (Exception ex)
                {
                    throw new ArgumentOutOfRangeException((string)null, ex.Message);
                }
                int num4 = (int)(num2 - (long)num3);
                time = time.AddMinutes((double)num4);
            }
            return time;
        }

        internal static bool TryGetProperty(
            ManagementBaseObject @object,
            string propertyName,
            out object value)
        {
            foreach (PropertyData property in @object.Properties)
            {
                if (property.Name == propertyName)
                {
                    value = property.Value;
                    return true;
                }
            }
            value = null;
            return false;
        }


        internal class ComparerByPriority : IComparer<string>
        {
            private StringComparer comp = StringComparer.InvariantCultureIgnoreCase;
            public string[] Priority;
            public string[] All;

            public ComparerByPriority(string[] priority, string[] all)
            {
                this.Priority = priority ?? new string[0];
                this.All = all;
            }

            public int Compare(string x, string y)
            {
                return this.GetOrder(x).CompareTo(this.GetOrder(y));
            }

            private int GetOrder(string arg)
            {
                int ignoreCase = this.FindIgnoreCase(this.Priority, arg);
                if (ignoreCase >= 0)
                    return ignoreCase - 10000;
                return this.FindIgnoreCase(this.All, arg);
            }

            private int FindIgnoreCase(string[] arr, string value)
            {
                for (int index = 0; index < arr.Length; ++index)
                {
                    if (this.comp.Equals(arr[index], value))
                        return index;
                }
                return -1;
            }
        }
    }
}
