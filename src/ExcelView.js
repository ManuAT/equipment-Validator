import React,{useState} from 'react'
import { Grid, Input,Select } from 'react-spreadsheet-grid'


export default function ExcelView() {

    const rows1 = [
        { id: 'user1', name: 'John Doe', positionId: 'position1', managerId: 'manager1' },
        { id: 'user12', name: 'John Doe', positionId: 'position1', managerId: 'manager1' }
        // and so on...
    ];
    const somePositions =['position1',"position2"]
    const [rows, setRows] = useState(rows1);
    
    // A callback called every time a value changed.
    // Every time it save a new value to the state.
    const onFieldChange = (rowId, field) => (value) => {
        // Find the row that is being changed
        const row = rows.find( (id)  => id.id === rowId);
        console.log("row",row,value.target.value);
        // Change a value of a field
        row[field] = value.target.value;
        setRows([].concat(rows))
    }
    
    const initColumns = () => [
      {
        title: () => 'Name',
        value: (row, { focus }) => {
          // You can use the built-in Input.
          return (
            <input
              value={row.name}
    
              onChange={onFieldChange(row.id, 'name')}
            />
          );
        }
      }, {
        title: () => 'Position',
        value: (row, { focus }) => {
            // You can use the built-in Select.
            return (
                // <Select
                //   value={row.positionId}
                //   isOpen={focus}
                //   items={somePositions}
                //   onChange={onFieldChange(row.id, 'positionId')}
                // />

                <select  value={row.positionId} onChange={onFieldChange(row.id,'positionId')} >
                <option value="position2">position2</option>
                <option value="position1">position1</option>
                <option value="position3">position3</option>
                </select>
               
            );
        }
      }
    ]

    return (
        <Grid
            columns={initColumns()}
            rows={rows}
            isColumnsResizable
            
            getRowKey={row => row.id}
        />
    )
}
