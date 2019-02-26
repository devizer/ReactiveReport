Get-WmiObject -query 'SELECT * FROM meta_class' | 
 where { ($_.Name -like 'Win32*') -and (-not ($_.Name -like 'Win32_Perf*')) } | 
 ft -Property name