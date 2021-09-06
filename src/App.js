import React,{useState} from 'react';
import './App.css';
// import ExcelView from './ExcelView'
import {Button,Card} from 'antd';

import EditableTable from './EditableTable'
import * as XLSX from 'xlsx';

function App() {
  
  const [columnsName, setColumnsName] = useState([]);
  const [data, setData] = useState([]);

  // process CSV data
  const processData = dataString => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
    
    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
      if (headers && row.length == headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] == '"')
              d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == '"')
              d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter(x => x).length > 0) {
          list.push(obj);
        }
      }
    }
    
    // prepare columns list from headers
    const columns = headers.map(c => ({
      name: c,
      selector: c,
    }));

    setData(list);
    setColumnsName(columns);



  }

  // handle file upload
  const handleFileUpload = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];

      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);
  }

  // check for local Storage
  const handelLocalStorage =()=>{
      const validatorData = localStorage.getItem('validatorData');
      setData(JSON.parse(validatorData))
  }


  return (
    <div>
   
    <div className="headerClass">
      <div className="header_title__10x6m">
      Nectar Onboarding Validator
      </div>
    </div>

    <div className="site-card-border-less-wrapper" style={{marginTop:'56px',position:'absolute',width:"100%"}}>
    <Card title={data.length>0? "Rows : "+data.length+" Validation errors : (..)": "Upload csv/excel"}  bordered={false} style={{background:'#83c5be'}} extra={
      <div className="mainBody"   >
      {data.length == 0 ? <div className="uploadBtn" >
      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileUpload}
      />
      {
      localStorage.getItem('validatorData') != null ?
      <Button
            onClick={handelLocalStorage}
            type="primary"
          
        >Continue with Save</Button> : null }
      </div> : null}
      
    </div>
    }>

    </Card>

    </div>
    {data.length>0 ? <EditableTable data={data} /> : null}
    </div>
  );
}


// https://www.geeksforgeeks.org/file-uploading-in-react-js/


export default App;
