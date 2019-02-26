using System;
using System.Data;
using System.Diagnostics;
using System.Management;

namespace WindowsBootInfo
{
    class WmiUtilsLegacy
    {
        public static bool TrySelect(
        string wql,
        string[] fieldsByPriority,
        out DataTable objects,
        out Exception failOfGet)
        {
            Stopwatch stopwatch = Stopwatch.StartNew();
            DataTable dataTable = new DataTable("WMI");
            int rowIndex = 0;
            using (ManagementObjectSearcher managementObjectSearcher = new ManagementObjectSearcher(wql))
            {
                try
                {
                    foreach (ManagementBaseObject wmiRow in managementObjectSearcher.Get())
                    {
                        DataRow row = dataTable.NewRow();
                        if (rowIndex == 0)
                        {
                            // Properties of the First Row.
                            string[] propertyNames = new string[wmiRow.Properties.Count];
                            int propertyIndex = 0;
                            foreach (PropertyData property in wmiRow.Properties)
                                propertyNames[propertyIndex++] = property.Name;

                            WmiUtils.ComparerByPriority comparerByPriority = new WmiUtils.ComparerByPriority(fieldsByPriority ?? new string[0], propertyNames);
                            Array.Sort(propertyNames, comparerByPriority);
                            foreach (string columnName in propertyNames)
                                dataTable.Columns.Add(columnName, typeof(object));
                        }

                        foreach (DataColumn column in dataTable.Columns)
                        {
                            object propertyValue;
                            if (WmiUtils.TryGetProperty(wmiRow, column.ColumnName, out propertyValue))
                            {
                                row[column.ColumnName] = propertyValue;
                                object copy = row[column.ColumnName];
                            }
                        }
                        dataTable.Rows.Add(row);
                        ++rowIndex;
                    }
                }
                catch (Exception ex)
                {
                    objects = (DataTable)null;
                    failOfGet = ex;
                    return false;
                }
            }
            Trace.WriteLine("Scan WMI list '" + wql + "' by " + stopwatch.ElapsedMilliseconds.ToString("n0") + " msec");
            objects = dataTable;
            failOfGet = (Exception)null;
            return true;
        }

        public static bool TrySelectAll(
          string className,
          string[] fieldsByPriority,
          out DataTable objects,
          out Exception failOfGet)
        {
            return WmiUtilsLegacy.TrySelect("Select * From " + className, fieldsByPriority, out objects, out failOfGet);
        }

        public static DataTable BuildFailReport(string caption, string htmlContent)
        {
            DataTable dataTable = new DataTable();
            dataTable.Columns.Add(caption);
            DataRow row = dataTable.NewRow();
            row[caption] = (object)htmlContent;
            dataTable.Rows.Add(row);
            return dataTable;
        }
    }
}