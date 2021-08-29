import React,{useState} from 'react'
import { Grid,Input,Select } from 'react-spreadsheet-grid'
import { v4 as uuidv4 } from 'uuid';

export default function ExcelView({data,columnsName}) {

    // console.log(data,columnsName);
    var row2 =[]
    row2 = data.map(obj=> ({ ...obj, id: uuidv4() }))


    // const rows1 = [
    //     { id: uuidv4(), client: 'nectar', deviceId: 'Win-3470-EF83-AAC7-0016', community:"downtown" ,siteName:'OTCI Attareen',equipmentName:'ATREN 1F FCU Lift Lobby Core A',equipmentType:'FanCoilUnit',assetCode:'0187902',pointsData:'Run Status@BMS Schedule Enable@Manual Occupancy@Return Temperature@Space Humidity@Valve Position@Supervisory Fan Speed@Fan Operation Command@Return Temperature Setpoint@Unoccupied Setpoint'},
    //     { id: uuidv4(), client: 'nectar', deviceId: 'Win-3470-EF83-AAC7-0016', community:"downtown" ,siteName:'OTCI Attareen',equipmentName:'ATREN 1F FCU Lift Lobby Core A',equipmentType:'FanCoilUnit',assetCode:'0187902',pointsData:'Run Status@BMS Schedule Enable@Manual Occupancy@Return Temperature@Space Humidity@Valve Position@Supervisory Fan Speed@Fan Operation Command@Return Temperature Setpoint@Unoccupied Setpoint'}
    //     // and so on...
    // ];

    const rows2 = row2
    console.log(rows2);

    const somePositions =[{
        id: 'nectarit',
        name: 'nectarit'
    }, {
        id: 'emaar',
        name: 'emaar'
    },
    {
      id: 'netix',
      name: 'netix'
    }
  ];

    const someEquip =[{
      id: 'FanCoilUnit',
      name: 'FanCoilUnit'
  }, {
      id: 'BTUMeter',
      name: 'BTUMeter'
    },
    {
      id: 'BoosterPump',
      name: 'BoosterPump'
    },{
      id: 'DDCController',
      name: 'DDCController'
    }
    
  ]

    const [rows, setRows] = useState(rows2);
    
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
        id:0,
        title: () => 'client*',
        value: (row, { focus }) => {
          return (
            <Select
                selectedId={row.client}
                isOpen={focus}
                items={somePositions}
                onChange={onFieldChange(row.id, 'client')}
                />
          );
        }
      }, {
        id:1,
        title: () => 'deviceId',
        value: (row, { focus }) => {
            return (

              <Input type="text"
              value={row.deviceId}
              onChange={onFieldChange(row.id, 'deviceId')}
              focus = {focus}
            />
            );
        }
      },
      {
        id:2,
        title: () => 'community*',
        value: (row, { focus }) => {
            return (

              <Input type="text"
              value={row.community}
              onChange={onFieldChange(row.id, 'community')}
              focus = {focus}
            />
            );
        }
      },
      {
        id:3,
        title: () => 'siteName*',
        value: (row, { focus }) => {
            return (

              <Input type="text"
              value={row.siteName}
              onChange={onFieldChange(row.id, 'siteName')}
              focus = {focus}
            />
            );
        }
      },
      {
        id: 4,
        title: () => 'equipmentName*',
        value: (row, { focus }) => {
            return (

              <Input type="text"
              value={row.equipmentName}
              onChange={onFieldChange(row.id, 'equipmentName')}
              focus = {focus}
            />
            );
        }
      },
      {
        id:5,
        title: () => 'equipmentType*',
        value: (row, { focus }) => {
            return (

                <Select
                selectedId={row.equipmentType}
                isOpen={focus}
                items={someEquip}
                onChange={onFieldChange(row.id, 'equipmentType')}
                />
            );
        }
      },
      {
        id:6,
        title: () => 'assetCode',
        value: (row, { focus }) => {
            return (

              <Input type="text"
              value={row.assetCode}
              onChange={onFieldChange(row.id, 'assetCode')}
              focus = {focus}
            />
            );
        }
      },
      {
        id:7,
        title: () => 'pointsData*',
        value: (row, { focus }) => {
            return (

              <Input type="text"
              value={row.pointsData}
              onChange={onFieldChange(row.id, 'pointsData')}
              focus = {focus}
            />
            );
        }
      }
      ,
      {
        id:8,
        title: () => 'roomsData',
        value: (row, { focus }) => {
            return (

              <Input type="text"
              value={row.roomsData}
              onChange={onFieldChange(row.id, 'roomsData')}
              focus = {focus}
            />
            );
        }
      },
      {
        id:9,
        title: () => 'floorsData',
        value: (row, { focus }) => {
            return (

              <Input type="text"
              value={row.floorsData}
              onChange={onFieldChange(row.id, 'floorsData')}
              focus = {focus}
            />
            );
        }
      },
      {
        id:10,
        title: () => 'commonAreaData',
        value: (row, { focus }) => {
            return (

              <Input type="text"
              value={row.commonAreaData}
              onChange={onFieldChange(row.id, 'commonAreaData')}
              focus = {focus}
            />
            );
        }
      },
      {
        id:11,
        title: () => 'servingToData',
        value: (row, { focus }) => {
            return (

              <Input type="text"
              value={row.servingToData}
              onChange={onFieldChange(row.id, 'servingToData')}
              focus = {focus}
            />
            );
        }
      },
      {
        id:12,
        title: () => 'servingByData',
        value: (row, { focus }) => {
            return (

              <Input type="text"
              value={row.servingByData}
              onChange={onFieldChange(row.id, 'servingByData')}
              focus = {focus}
            />
            );
        }
      },
      {
        id:13,
        title: () => 'contractAccountNumber',
        value: (row, { focus }) => {
            return (

              <Input type="text"
              value={row.contractAccountNumber}
              onChange={onFieldChange(row.id, 'contractAccountNumber')}
              focus = {focus}
            />
            );
        }
      },
      {
        id:14,
        title: () => 'premiseNo',
        value: (row, { focus }) => {
            return (

              <Input type="text"
              value={row.premiseNo}
              onChange={onFieldChange(row.id, 'premiseNo')}
              focus = {focus}
            />
            );
        }
      },
      {
        id:15,
        title: () => 'meterNumber',
        value: (row, { focus }) => {
            return (

              <Input type="text"
              value={row.meterNumber}
              onChange={onFieldChange(row.id, 'meterNumber')}
              focus = {focus}
            />
            );
        }
      }
    ]




     // Put columns to the state to be able to store there their width values.
     const [columns, setColumns] = useState(initColumns())

     // Change columns width values in the state to not lose them.
     const onColumnResize = (widthValues) => {
        console.log(widthValues);

         const newColumns = [].concat(columns).map(obj=> ({ ...obj, width:0 }))
         Object.keys(widthValues).forEach((columnId) => {
             newColumns[columnId].width = widthValues[columnId]
         })

         console.log(newColumns);

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