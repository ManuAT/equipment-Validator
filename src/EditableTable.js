import React, { useContext, useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Table, Input, Button, Popconfirm, Form ,Select,Space} from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver'

import './EditableTable.css'
const EditableContext = React.createContext(null);

function validator(columnName){
  switch(columnName){
    case 'client': return new RegExp(/^[a-z]+$/) //netix
    case 'deviceId': return new RegExp("^[A-Za-z]{3}\-[A-Z0-9]{4}\-[A-Z0-9]{4}\-[A-Z0-9]{4}\-[A-Z0-9]{4}$") //Win-3470-EF83-AAC7-0016
    case 'community': return new RegExp(/^[a-z]+$/)//downtown
    case 'siteName': return new RegExp(/^[A-Z]{3,} [A-Z][a-z]+( [0-9]{2,})*$/)
    case 'equipmentName': return new RegExp(/^[A-Z]{3,} [A-Z0-9]{2} [A-Z]{3,} [A-Z][a-z]{2,} [A-Z][a-z]{2,} [A-Z][a-z]{2,} [A-Z]$/)
    case 'equipmentType': return new RegExp(/^[a-zA-Z]+$/)
    case 'assetCode': return new RegExp(/^[0-9]{7}$/)
   
    
    default: return new RegExp(/^.*$/)

  }
}



const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    updateDataSourceWithValidation,
    selectDropDownValues,
    ...restProps
  }) => {
    // console.log(children[1]);
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
  
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
  
    const save = async () => {
      try {
        var validArray = []
        const values = await form.validateFields();
        toggleEdit();
        // console.log(Object.keys(values))
        handleSave({ ...record, ...values });
        updateDataSourceWithValidation(record,Object.keys(values),false)

      } catch (errInfo) {
        console.log('Save failed:', errInfo);
        toggleEdit();
        handleSave({ ...record, ...errInfo.values});
        updateDataSourceWithValidation(record,errInfo.errorFields[0].name,true)
      }
    };

    const handeleValidate = async () => {
      try {
        const values = await form.validateFields();
      } catch (errInfo) {
        // console.log('validation errors:', errInfo);
      }
    };
    // temp data
    
  
    let childNode = children;
    const { Option } = Select;
    const { TextArea } = Input;
    if (editable) {
        childNode = editing ? (
          <Form.Item
            style={{
              margin: 0,
            }}

            name={dataIndex}

            rules={[
              {
                required: true,
                pattern: validator(title),
                message: `${title} is required.`,
              },
            ]}

          >
            {

              title == 'client'?( 
                <Select ref={inputRef} defaultValue={children[1]} style={{ width: 100 }} onChange={save} onBlur={save} >
                {selectDropDownValues.map((value)=> <Option key={value.id} value={value.id}>{value.name}</Option>)}
                </Select>
              
              ):
                
              (<TextArea style={{ width: '370px' }}  ref={inputRef} onPressEnter={save} onFocus={handeleValidate} onBlur={save} autoSize /> )
            }

            
          </Form.Item>
        ) : (


          

         <div
            className="editable-cell-value-wrap" style={{fontSize:"14px"}}
            onClick={toggleEdit}
            >
              {/* {typeof children[1] != "string"? 'noo' : children[1].length>25?children[1].substring(0,25)+"...":children[1]} */}
              {children[1].length>25?children[1].substring(0,25)+"...":children[1]}
              {/* {children} */}
          </div> 


        );
      }
    
      return <td {...restProps}>{childNode}</td>;
    };

class EditableTable extends React.Component {
  // handle filter
  state = {
    searchText: '',
    searchedColumn: '',
  };
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
       
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };


// need to fix fillter issue

  // handle table
    constructor(props) {
      super(props);
      this.columns = [

        {
          title: 'No',
          dataIndex: 'No',
          width: 70,
          render:(_, record)=>{
            // console.log({record}); this.selectDropDownValues.name?.includes(record.client)
            const postion = this.state.dataSource.indexOf(record)
            return <span >{postion+1}</span>
          }
        },
         {
          title: 'client',
          dataIndex: 'client',
          width: 140,
          editable: true,
          ...this.getColumnSearchProps('client'),
          sorter: (a, b) => a.client.length - b.client.length,
          sortDirections: ['descend', 'ascend'],
          render:(_, record)=>{
            // console.log({record}); this.selectDropDownValues.name?.includes(record.client)
            const isError = record.vaildationStatus?.includes("client") || this.selectDropDownValues.find(value => value.name == record.client)==undefined;
            return <span style={{color:isError?"red":"black"}}>{record.client}</span>
          }
        },
        {
          title: 'deviceId',
          dataIndex: 'deviceId',
          width: 250,
          editable: true,
          ...this.getColumnSearchProps('deviceId'),
          sorter: (a, b) => a.deviceId.length - b.deviceId.length,
          sortDirections: ['descend', 'ascend'],
          render:(_, record)=>{
            const isError = record.vaildationStatus?.includes("deviceId");
            return <span style={{color:isError?"red":"black"}}>{record.deviceId}</span>
          }
        },
        {
          title: 'community',
          dataIndex: 'community',
          width: 150,
          editable: true,
          ...this.getColumnSearchProps('community'),
          sorter: (a, b) => a.community.length - b.community.length,
          sortDirections: ['descend', 'ascend'],
          render:(_, record)=>{
            const isError = record.vaildationStatus?.includes("community");
            return <span style={{color:isError?"red":"black"}}>{record.community}</span>
          }
        },
        {
          title: 'siteName',
          dataIndex: 'siteName',
          width: 150,
          editable: true,
          ...this.getColumnSearchProps('siteName'),
          sorter: (a, b) => a.siteName.length - b.siteName.length,
          sortDirections: ['descend', 'ascend'],
          render:(_, record)=>{
            const isError = record.vaildationStatus?.includes("siteName");
            return <span style={{color:isError?"red":"black"}}>{record.siteName}</span>
          }
        },
        {
          title: 'equipmentName',
          dataIndex: 'equipmentName',
          editable: true,
          width: 280,
          ...this.getColumnSearchProps('equipmentName'),
          sorter: (a, b) => a.equipmentName.length - b.equipmentName.length,
          sortDirections: ['descend', 'ascend'],
          render:(_, record)=>{
            const isError = record.vaildationStatus?.includes("equipmentName");
            return <span style={{color:isError?"red":"black"}}>{record.equipmentName}</span>
          }
        },
        {
          title: 'equipmentType',
          dataIndex: 'equipmentType',
          width: 200,
          editable: true,
          ...this.getColumnSearchProps('equipmentType'),
          sorter: (a, b) => a.equipmentType.length - b.equipmentType.length,
          sortDirections: ['descend', 'ascend'],
          render:(_, record)=>{
            const isError = record.vaildationStatus?.includes("equipmentType");
            return <span style={{color:isError?"red":"black"}}>{record.equipmentType}</span>
          }
        },
        {
          title: 'assetCode',
          dataIndex: 'assetCode',
          width: 100,
          editable: true,
          ...this.getColumnSearchProps('assetCode'),
          sorter: (a, b) => a.assetCode.length - b.assetCode.length,
          sortDirections: ['descend', 'ascend'],
          render:(_, record)=>{
            const isError = record.vaildationStatus?.includes("assetCode");
            return <span style={{color:isError?"red":"black"}}>{record.assetCode}</span>
          }
        },
        {
          title: 'pointsData',
          dataIndex: 'pointsData',
          width: 280,
          editable: true,
          ...this.getColumnSearchProps('pointsData'),
          sorter: (a, b) => a.pointsData.length - b.pointsData.length,
          sortDirections: ['descend', 'ascend'],
          // render:(_, record)=>{
          //   const isError = record.vaildationStatus?.includes("pointsData");
          //   return <span style={{color:isError?"red":"black"}}>{record.pointsData}</span>
          // }
        },
        {
          title: 'roomsData',
          dataIndex: 'roomsData',
          width: 280,
          editable: true,
          ...this.getColumnSearchProps('roomsData'),
          sorter: (a, b) => a.roomsData.length - b.roomsData.length,
          sortDirections: ['descend', 'ascend'],
          // render:(_, record)=>{
          //   const isError = record.vaildationStatus?.includes("roomsData");
          //   return <span style={{color:isError?"red":"black"}}>{record.roomsData}</span>
          // }
        },
        {
          title: 'floorsData',
          dataIndex: 'floorsData',
          width: 250,
          editable: true,
          ...this.getColumnSearchProps('floorsData'),
          sorter: (a, b) => a.floorsData.length - b.floorsData.length,
          sortDirections: ['descend', 'ascend'],
          // render:(_, record)=>{
          //   const isError = record.vaildationStatus?.includes("floorsData");
          //   return <span style={{color:isError?"red":"black"}}>{record.floorsData}</span>
          // }
        },
        {
          title: 'commonAreaData',
          dataIndex: 'commonAreaData',
          width: 250,
          editable: true,
          ...this.getColumnSearchProps('commonAreaData'),
          sorter: (a, b) => a.commonAreaData.length - b.commonAreaData.length,
          sortDirections: ['descend', 'ascend'],
          // render:(_, record)=>{
          //   const isError = record.vaildationStatus?.includes("commonAreaData");
          //   return <span style={{color:isError?"red":"black"}}>{record.commonAreaData}</span>
          // }
        },
        {
          title: 'servingToData',
          dataIndex: 'servingToData',
          width: 400,
          editable: true,
          sorter: (a, b) => a.servingToData.length - b.servingToData.length,
          sortDirections: ['descend', 'ascend'],
          // render:(_, record)=>{
          //   const isError = record.vaildationStatus?.includes("servingToData");
          //   return <span style={{color:isError?"red":"black"}}>{record.servingToData}</span>
          // }
        },  
        {
          title: 'servingByData',
          dataIndex: 'servingByData',
          width: 400,
          editable: true,
          ...this.getColumnSearchProps('servingByData'),
          sorter: (a, b) => a.servingByData.length - b.servingByData.length,
          sortDirections: ['descend', 'ascend'],
          // render:(_, record)=>{
          //   const isError = record.vaildationStatus?.includes("servingByData");
          //   return <span style={{color:isError?"red":"black"}}>{record.servingByData}</span>
          // }
        },
        {
          title: 'contractAccountNumber',
          dataIndex: 'contractAccountNumber',
          width: 210,
          editable: true,
          ...this.getColumnSearchProps('contractAccountNumber'),
          sorter: (a, b) => a.contractAccountNumber.length - b.contractAccountNumber.length,
          sortDirections: ['descend', 'ascend'],
          render:(_, record)=>{
            const isError = record.vaildationStatus?.includes("contractAccountNumber");
            return <span style={{color:isError?"red":"black"}}>{record.contractAccountNumber}</span>
          }
        },
        {
          title: 'premiseNo',
          dataIndex: 'premiseNo',
          width: 150,
          editable: true,
          ...this.getColumnSearchProps('premiseNo'),
          sorter: (a, b) => a.premiseNo.length - b.premiseNo.length,
          sortDirections: ['descend', 'ascend'],
          render:(_, record)=>{
            const isError = record.vaildationStatus?.includes("premiseNo");
            return <span style={{color:isError?"red":"black"}}>{record.premiseNo}</span>
          }
        },
        {
          title: 'meterNumber',
          dataIndex: 'meterNumber',
          width: 150,
          editable: true, ...this.getColumnSearchProps('meterNumber'),
          sorter: (a, b) => a.meterNumber.length - b.meterNumber.length,
          sortDirections: ['descend', 'ascend'],
          render:(_, record)=>{
            const isError = record.vaildationStatus?.includes("meterNumber");
            return <span style={{color:isError?"red":"black"}}>{record.meterNumber}</span>
          }
        },
        {
          title: 'operation',
          dataIndex: 'operation',
          width: 100,
          fixed: 'right',
          render: (_, record) =>
            this.state.dataSource.length >= 1 ? (
              <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                <a style={{fontSize:"14px"}}>Delete</a>
              </Popconfirm>
            ) : null,
        },
      ];

      // addind validation to inputing data
      var dataInputFromFile = this.props.data.map(obj=> ({ ...obj, key: uuidv4() }))
      dataInputFromFile = [...dataInputFromFile].map(obj => ({...obj,vaildationStatus:this.intialValidation(obj)}))
      this.state = {
        dataSource:dataInputFromFile,

         // [
        //   // {
        //   //   key: '0',
        //   //   name: 'Edward King 0',
        //   //   age: '32',
        //   //   address: 'London, Park Lane no. 0',
        //   // },
        //   // {
        //   //   key: '1',
        //   //   name: 'Edward King 1',
        //   //   age: '32',
        //   //   address: 'London, Park Lane no. 1',
        //   // },
        //   { key: uuidv4(), client: 'nectar', deviceId: 'Win-3470-EF83-AAC7-0016', community:"downtown" ,siteName:'OTCI Attareen',equipmentName:'ATREN 1F FCU Lift Lobby Core A',equipmentType:'FanCoilUnit',assetCode:'0187902',pointsData:'Run Status@BMS Schedule Enable@Manual Occupancy@Return Temperature@Space Humidity@Valve Position@Supervisory Fan Speed@Fan Operation Command@Return Temperature Setpoint@Unoccupied Setpoint'}
        // ],
        count: this.props.data.length,
      };
    }

     selectDropDownValues =[{
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

    intialValidation = (record)=>{
      let validationArray = []
      for (let [key, value] of Object.entries(record)) {
       if( validator(key).exec(value) == null)
          validationArray.push(key)
    }
      return validationArray
    }

    updateDataSourceWithValidation = (record,validationArray,action)=>{


      const dataSource = [...this.state.dataSource];
      this.setState({
        dataSource: dataSource.map((item) => {        
        var temp = Object.assign({}, item);
        if (temp.key == record.key) {
          action? temp.vaildationStatus = [...temp.vaildationStatus].concat(validationArray) : temp.vaildationStatus = temp.vaildationStatus.filter( ( el ) => !validationArray.includes( el ) )
        }
        return temp;
      })

      });

      console.log("data",[...this.state.dataSource])
    }
  
    handleDelete = (key) => {
      const dataSource = [...this.state.dataSource];
      this.setState({
        dataSource: dataSource.filter((item) => item.key !== key),
      });
    };
    handleAdd = () => {
      const { count, dataSource } = this.state;
      const newData = {
        assetCode: "",
        client: "",
        commonAreaData: "",
        community: "",
        contractAccountNumber: "",
        deviceId: "",
        equipmentName: "",
        equipmentType: "",
        floorsData: "",
        key: uuidv4(),
        meterNumber: "",
        pointsData: "",
        premiseNo: "",
        roomsData: "",
        servingByData: "",
        servingToData: "",
        siteName: "",
        vaildationStatus:[]
      };
      this.setState({
        dataSource: [...dataSource, newData],
        count: count + 1,
      });
    };
    handleSave = (row) => {
      const newData = [...this.state.dataSource];
      const index = newData.findIndex((item) => row.key === item.key);
      const item = newData[index];
      newData.splice(index, 1, { ...item, ...row });
      localStorage.setItem('validatorData',JSON.stringify(newData));
      this.setState({
        dataSource: newData, 
      });
    };
    

    // download excel
     handleDownload = e =>{
 
      var wb = XLSX.utils.book_new();

      wb.Props = {
        Title: "Nectar-onboard-Validator",
        Subject: "Test",
        Author: "Manu",
        CreatedDate: new Date(2021,8,27)
        };
    
        wb.SheetNames.push("sheet1");
        var rowData = [].concat(this.state.dataSource)
        var ws = XLSX.utils.json_to_sheet(rowData.map(({key, ...remainingAttrs}) => remainingAttrs));
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

    render() {
      const { dataSource } = this.state;
      // console.log(dataSource);

      const components = {
        body: {
          row: EditableRow,
          cell: EditableCell,
        },
      };
      const columns = this.columns.map((col) => {
        if (!col.editable) {
          return col;
        }
  
        return {
          ...col,
          onCell: (record) => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave: this.handleSave,
            updateDataSourceWithValidation : this.updateDataSourceWithValidation,
            selectDropDownValues : this.selectDropDownValues
          }),
        };
      });
      return (
        <div style={{zIndex:"999",position:"absolute",marginTop:"115px",padding:"6px",width:"100%"}}>
          <Button
            onClick={this.handleAdd}
            type="primary"
            style={{
              marginBottom: 16,
            }}
          >
            Add a row
          </Button> <Button
            onClick={this.handleDownload}
            type="primary"
            style={{
              marginBottom: 16,
            }}
          >
            Download
          </Button>
          <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={dataSource}
            columns={columns}
            scroll={{x: 1800, y: 550 }}
          />
        </div>
      );
    }
  }
      

export default EditableTable