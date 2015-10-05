-- Это postgresql 

INSERT INTO table4 (internal_number, month, name_surname, position, salary_month, tax)
SELECT 
	DISTINCT ON (table3.internal_number, table2.month) table3.internal_number, table2.month,
	concat(table1.name, '/', table1.surname), 
	table3.position, 
	table1.salary, 
	table2.taxes
FROM
	table3, table2, table1
WHERE
	table3.employeeid = table2.employee_id
	AND table3.employeeid = table1.id
