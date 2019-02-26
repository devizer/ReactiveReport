$list = Get-WmiObject -Query "Select * From Win32_NTLogEvent WHERE LogFile='System' And (EventCode=12 Or EventCode=7009 or EventCode=7000 or EventCode=7036)"
$list[0].Properties
