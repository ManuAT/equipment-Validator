import React,{useState} from 'react'
import { Grid,Input,Select } from 'react-spreadsheet-grid'
import { v4 as uuidv4 } from 'uuid';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Button,Modal,FloatingLabel,Form } from 'react-bootstrap';
export default function ExcelView({data,columnsName}) {
    // -------INPUT data handle
    // console.log(data,columnsName);
    var row2 =[]
    row2 = data.map(obj=> ({ ...obj, id: uuidv4() }))
    // const rows1 = [
    //     { id: uuidv4(), client: 'nectar', deviceId: 'Win-3470-EF83-AAC7-0016', community:"downtown" ,siteName:'OTCI Attareen',equipmentName:'ATREN 1F FCU Lift Lobby Core A',equipmentType:'FanCoilUnit',assetCode:'0187902',pointsData:'Run Status@BMS Schedule Enable@Manual Occupancy@Return Temperature@Space Humidity@Valve Position@Supervisory Fan Speed@Fan Operation Command@Return Temperature Setpoint@Unoccupied Setpoint'},
    //     { id: uuidv4(), client: 'nectar', deviceId: 'Win-3470-EF83-AAC7-0016', community:"downtown" ,siteName:'OTCI Attareen',equipmentName:'ATREN 1F FCU Lift Lobby Core A',equipmentType:'FanCoilUnit',assetCode:'0187902',pointsData:'Run Status@BMS Schedule Enable@Manual Occupancy@Return Temperature@Space Humidity@Valve Position@Supervisory Fan Speed@Fan Operation Command@Return Temperature Setpoint@Unoccupied Setpoint'}
    //     // and so on...
    // ];

    const rows2 = row2

    // ---------handle Modal ------------
    const [show, setShow] = useState(false);
    const [dataToModal, setdataToModal] = useState();

    const handleClose = () => setShow(false)
                               
    const handleShow = () => setShow(true);
    // console.log({show});
    // -------temporary-dropDown----------

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

  // ----------handle rowChange-------
    const [rows, setRows] = useState(rows2);
    
    // A callback called every time a value changed.
    // Every time it save a new value to the state.
    const onFieldChange = (rowId, field) => (value) => {
        // Find the row that is being changed
        const row = rows.find( (id)  => id.id === rowId);
        // console.log("row",row,value);
        // Change a value of a field
        row[field] = value;
        setRows([].concat(rows))
    }

    const onFieldChange2 = (rowId, field) => (value) => {
      // Find the row that is being changed
      const row = rows.find( (id)  => id.id == rowId);
      // console.log("row",row,value);
      // Change a value of a field
      row[field] = value.target.value;
      setRows([].concat(rows))
    }
    
    
    // ------colunm array-----------
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
        value: (row, { focus,active }) => {
            // console.log("focus status",focus,active)
           if(focus){
            handleShow()
            setdataToModal(row.servingToData+"&"+"servingToData"+'&'+row.id)
           }
            return(
              <Input type="text"
              value={row.servingToData}
              onChange={onFieldChange(row.id, 'servingToData')}
              focus = {focus}
            />
             )
             
            
        

        },
        width:12
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
        },
        width:12
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
      const newColumns = [].concat(columns)
      Object.keys(widthValues).forEach((columnId) => {
          const column = columns.find(({ id }) => id == columnId);
          column.width = widthValues[columnId]
      })
      setColumns(newColumns)
  }

  const handleDownload = e =>{
 
        var wb = XLSX.utils.book_new();

        wb.Props = {
          Title: "Nectar-onboard-Validator",
          Subject: "Test",
          Author: "Manu",
          CreatedDate: new Date(2021,8,27)
          };
      
          wb.SheetNames.push("sheet1");
          var rowData = [].concat(rows)
          var ws = XLSX.utils.json_to_sheet(rowData.map(({id, ...remainingAttrs}) => remainingAttrs));
          wb.Sheets["sheet1"] = ws;
          var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
            function s2ab(s) { 
              var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
              var view = new Uint8Array(buf);  //create uint8array as viewer
              for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
              return buf;    
            }
            saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'test.xlsx');
  }

    return (
      <div style={{ height: '800px' }}>
        <div className="downloadBtn" style={{float:'right',marginTop:'-96px'}}>
        <h3>download excel</h3>
        <Button variant="success" onClick={handleDownload}>download</Button>
        </div>
        <Grid
            columns={initColumns()}
            rows={rows}
            isColumnsResizable
            isScrollable
            columnWidthValues
            // focusOnSingleClick
            placeholder
            onColumnResize={onColumnResize}
            getRowKey={row => row.id}
        />
          { show &&
         <Modal show={show} onHide={handleClose}>
             <Modal.Header closeButton>
               <Modal.Title>{dataToModal.split('&')[1]}</Modal.Title>
             </Modal.Header>
             <Modal.Body>
              
              
              <FloatingLabel controlId="floatingTextarea2" label="Comments">
                <Form.Control
                  as="textarea"
                  placeholder="Leave a comment here"
                  style={{ height: '400px' }}
                  value = {(rows.find( (id)  => id.id == dataToModal.split('&')[2]))[dataToModal.split('&')[1]]}
                  onChange={onFieldChange2(dataToModal.split('&')[2],dataToModal.split('&')[1])}
                />
              </FloatingLabel>
               
               </Modal.Body>
             <Modal.Footer>
               <Button variant="secondary" onClick={handleClose}>
                 Close
               </Button>
               <Button variant="primary" onClick={handleClose}>
                 Save Changes
               </Button>
             </Modal.Footer>
           </Modal>
          }
        </div>
    )
}
