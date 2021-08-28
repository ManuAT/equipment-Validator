import React,{useState} from 'react'
import { Grid,Input,Select } from 'react-spreadsheet-grid'
import { v4 as uuidv4 } from 'uuid';

export default function ExcelView() {

     

    const rows1 = [
        { id: uuidv4(), name: 'John Doe', positionId: 1, managerId: 'manager1' },
        { id: uuidv4(), name: 'John Doe', positionId: 1, managerId: 'manager1' },
        { id: uuidv4(), name: 'John Doe', positionId: 1, managerId: 'manager1' },
        { id: uuidv4(), name: 'John Doe', positionId: 1, managerId: 'manager1' },
        { id: uuidv4(), name: 'John Doe', positionId: 1, managerId: 'manager1' },
        { id: uuidv4(), name: 'John Doe', positionId: 1, managerId: 'manager1' },
        { id: uuidv4(), name: 'John Doe', positionId: 1, managerId: 'manager1' }
        // and so on...
    ];
    const somePositions =[{
        id: 1,
        name: 'Frontend developer'
    }, {
        id: 2,
        name: 'Backend developer'
    }];

    const [rows, setRows] = useState(rows1);
    
    // A callback called every time a value changed.
    // Every time it save a new value to the state.
    const onFieldChange = (rowId, field) => (value) => {
        // Find the row that is being changed
        const row = rows.find( (id)  => id.id === rowId);
        console.log("row",row,value);
        // Change a value of a field
        row[field] = value;
        setRows([].concat(rows))
    }
    
    const initColumns = () => [
      {
        title: () => 'Name',
        value: (row, { focus }) => {
          return (
            <Input type="text"
              value={row.name}
              onChange={onFieldChange(row.id, 'name')}
              focus = {focus}
            />
          );
        }
      }, {
        title: () => 'Position',
        value: (row, { focus }) => {
            return (

                <Select
                selectedId={row.positionId}
                isOpen={focus}
                items={somePositions}
                onChange={onFieldChange(row.id, 'positionId')}
                />
            );
        }
      }
    ]




     // Put columns to the state to be able to store there their width values.
     const [columns, setColumns] = useState(initColumns())

     // Change columns width values in the state to not lose them.
     const onColumnResize = (widthValues) => {
         const newColumns = [].concat(columns)
         Object.keys(widthValues).forEach((columnId) => {
             newColumns[columnId].width = widthValues[columnId]
         })
         setColumns(newColumns)
     }

    return (
        <Grid
            columns={initColumns()}
            rows={rows}
            isColumnsResizable
            onColumnResize={onColumnResize}
            getRowKey={row => row.id}
        />
    )
}
