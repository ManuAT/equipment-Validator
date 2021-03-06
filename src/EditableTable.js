import React, { useContext, useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Table, Input, Button, Popconfirm, Form ,Select,Space,Checkbox} from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver'
import './EditableTable.css'
const EditableContext = React.createContext(null);

const { Option } = Select;
const { TextArea } = Input;

function patternValidator(columnName){
  switch(columnName){
    // case 'client': return new RegExp(/^[A-Za-z]+( [0-9]+)*$/) //netix
    case 'deviceId': return new RegExp("^[A-Za-z]{3}\-[A-Z0-9]{4}\-[A-Z0-9]{4}\-[A-Z0-9]{4}\-[A-Z0-9]{4}$") //Win-3470-EF83-AAC7-0016
    // case 'community': return new RegExp(/^[a-z]+$/)//downtown
    // case 'siteName': return new RegExp(/^[A-Za-z]{3,} [A-Z][a-z]+( [0-9]{2,})*$/)
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

        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
        // updateDataSourceWithValidation(record,Object.keys(values),false)
        updateDataSourceWithValidation()

      } catch (errInfo) {
        console.log('Save with error:', errInfo);

        // string validation space need to look it later ----------

        toggleEdit();

        handleSave({ ...record, ...errInfo.values});
        // updateDataSourceWithValidation(record,errInfo.errorFields[0].name,true)
        updateDataSourceWithValidation()
      }
    };

    const handeleValidate = async () => {
      try {
        const values = await form.validateFields();
      } catch (errInfo) {
      }
    };
    // temp data

    const ruleValidator = (rule, value, callback) => {
      try {
       if (title=='pointsData' && record.vaildationStatus.includes('pointsData')) {
        
            const pointData = value.split('@').filter(e=> !selectDropDownValues.pointsData.find(item  =>
              (item.domain == record.client && item.equipName == record.equipmentType)
              ).point.includes(e)) 
            // console.log("value at validation",pointData)
            // throw new Error(pointData);
            callback(pointData.join())
        }

        if (title=='equipmentName' && record.vaildationStatus.includes('equipmentName')) {
          callback('duplicate equipmentName')
        }

        // if(selectDropDownValues.client.find(data => data == record.client)==undefined && title=='client'){

        //     throw new Error('not in the list!');
        // }

        // if(selectDropDownValues.community.find(data => data.clientId == record.community && data.clientName == record.client)==undefined && title=='community'){
        //   throw new Error('not in the list!');
        // }

        // if(selectDropDownValues.site.find(data => data.name == record.siteName && data.ownerName == record.client && data.ownerClientId == record.community )==undefined && title=='siteName'){
        //   throw new Error('not in the list!');
        // }



        callback() // < -- this
      } catch (err) {
        callback(err);
      }
    }
    
  
    let childNode = children;
    // const { Option } = Select;
    // const { TextArea } = Input;
    if (editable) {
        childNode = editing ? (
          <Form.Item
            style={{
              margin: 0,
            }}

            name={dataIndex}

            rules={[
              {
                required: title == 'client' || title == 'community' || title =='siteName' || title == 'equipmentName' || title =='equipmentType'? true:false,
                // pattern: patternValidator(title),
                message: `error while validation/ required`,
              },
              {
                validator: ruleValidator
              }
              
            ]}

          >
            {
             
              title == 'equipmentType' ? (
                <Select showSearch ref={inputRef} defaultValue={children[1]} style={{ width: "100%" }} onChange={save} onBlur={save} >
                {selectDropDownValues["equipmentType"].map((value)=> value.domain == record.client? <Option key={value.equipName} value={value.equipName}>{value.equipName}</Option>:null)}
                </Select>
              ):(
              

              title == 'community' ? (
                <Select showSearch ref={inputRef} defaultValue={children[1]} style={{ width: "100%" }} onChange={save} onBlur={save} >
                {selectDropDownValues["community"].map((value)=> value.domain == record.client? <Option key={value.clientName} value={value.clientName}>{value.clientName}</Option>:null)}
                </Select>
              ):(

              title == 'siteName' ? (
                <Select  showSearch ref={inputRef} defaultValue={children[1]} style={{ width: "100%" }} onChange={save} onBlur={save} >
                {selectDropDownValues["site"].map((value)=> value.domain == record.client && value.ownerClientId == record.community? <Option key={value.name} value={value.name}>{value.name}</Option>:null)}
                </Select>
              ): (

              title == 'client' || title == 'deviceId' ?( 
                <Select showSearch ref={inputRef} defaultValue={children[1]} style={{ width: "100%" }} onChange={save} onBlur={save} >
                {selectDropDownValues[title].map((value)=> <Option key={value} value={value}>{value}</Option>)}
                </Select>
              
              ):
                
              (<TextArea style={{ width: '370px' }}  ref={inputRef} onPressEnter={save} onFocus={handeleValidate} onBlur={save} autoSize /> )

              )
              )
              )
              
            }

            
          </Form.Item>
        ) : (


          

         <div
            className="editable-cell-value-wrap" style={{fontSize:"14px",minHeight:'15px'}}
            onClick={toggleEdit}
            >
              {/* {typeof children[1] != "string"? 'noo' : children[1].length>25?children[1].substring(0,25)+"...":children[1]} */}
              {children[1].length>40?children[1].substring(0,40)+"...":children[1]}
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
        {/* replce code */}
      <Input
          ref={node => {
            this.replaceInput = node;
          }}
          placeholder={`Replace ${dataIndex}`}
          value={selectedKeys[1]}
          // onChange={e => this.setState( e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Checkbox ref={node => {this.allSelectCheckBox = node;}}>|Aa|</Checkbox>
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
    onFilter: (value, record) =>{
      // let replacementValue =''
      let newRecord = record[dataIndex].toString()
      const filType = record[dataIndex] ? record[dataIndex].toString().includes(value) : false
      if(this.replaceInput.state.value && filType){
        const replacementValue = this.replaceInput.state.value
        var regx = this.allSelectCheckBox.state.checked ?  new RegExp("^"+value+"$") : value;
        const newRecord2 =  newRecord.replace(regx,replacementValue)
        record[dataIndex] = newRecord2
        if (newRecord != newRecord2){
        this.handleSave({...record})
        this.updateDataSourceWithValidation()
        }
      }
      return filType
    },
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
    this.replaceInput.state.value = ""
    this.allSelectCheckBox.state.checked = false
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
            //  this.selectDropDownValues.name?.includes(record.client)
            const postion = this.state.dataSource.indexOf(record)
            return <span style={{fontSize:'14px'}}>{postion+1}</span>
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
            //  this.selectDropDownValues.name?.includes(record.client) this.selectDropDownValues.client.find(value => value == record.client)==undefined;
            const isError = record.vaildationStatus?.includes('client') 
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
            //  this.selectDropDownValues.community.find(value => value.clientName == record.community && value.domain == record.client)==undefined;
            const isError = record.vaildationStatus?.includes("community");
            return <span style={{color:isError?"red":"black"}}>{record.community}</span>
          }
        },
        {
          title: 'siteName',
          dataIndex: 'siteName',
          width: 200,
          editable: true,
          ...this.getColumnSearchProps('siteName'),
          sorter: (a, b) => a.siteName.length - b.siteName.length,
          sortDirections: ['descend', 'ascend'],
          render:(_, record)=>{
            // this.selectDropDownValues.site.find(value => value.name == record.siteName && value.domain == record.client && value.ownerClientId == record.community )==undefined;
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
            // this.selectDropDownValues.equipmentType.find(value => value.equipName == record.equipmentType && value.domain == record.client)==undefined;
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
          render:(_, record)=>{
            const isError = record.vaildationStatus?.includes("pointsData");
            return <span style={{color:isError?"red":"black"}}>{record.pointsData.length>25?record.pointsData.substring(0,30)+"...":record.pointsData}</span>
          }
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
          ...this.getColumnSearchProps('servingToData'),
          sorter: (a, b) => a.servingToData.length - b.servingToData.length,
          sortDirections: ['descend', 'ascend'],
          // render:(_, record)=>{
          //   const isError = !record.servingToData.split('@').every(item => this.selectDropDownValuesForService.includes(item));
          //   return <span style={{color:isError?"red":"black"}}>{record.servingToData.substring(0,25)+"..."}</span>
          // }
        },

        {
          title: 'servingSpaceData',
          dataIndex: 'servingSpaceData',
          width: 400,
          editable: true,
          ...this.getColumnSearchProps('servingSpaceData'),
          sorter: (a, b) => a.servingSpaceData.length - b.servingSpaceData.length,
          sortDirections: ['descend', 'ascend'],
         
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
      dataInputFromFile = [...dataInputFromFile].map(obj => ({...obj,vaildationStatus:this.intialValidation(obj,dataInputFromFile),assetCode:obj.assetCode.toString().padStart(7,'0')}))
      var errCount = {count:0,row:[]}
      dataInputFromFile.forEach(element => {
        if (element.vaildationStatus.length>0)  {errCount.count+=element.vaildationStatus.length
          errCount.row.push(dataInputFromFile.indexOf(element)+1)
        }
      });

      this.state = {
        dataSource:dataInputFromFile,

         // [
        //   { key: uuidv4(), client: 'nectar', deviceId: 'Win-3470-EF83-AAC7-0016', community:"downtown" ,siteName:'OTCI Attareen',equipmentName:'ATREN 1F FCU Lift Lobby Core A',equipmentType:'FanCoilUnit',assetCode:'0187902',pointsData:'Run Status@BMS Schedule Enable@Manual Occupancy@Return Temperature@Space Humidity@Valve Position@Supervisory Fan Speed@Fan Operation Command@Return Temperature Setpoint@Unoccupied Setpoint'}
        // ],
        count: this.props.data.length,
        errCount:errCount
      };
    }
    //  selectDropDownValues =[
    //   'nectarit',
    //   'emaar',
    //   'netix',
    // ];

    selectDropDownValues = JSON.parse(localStorage.getItem('api'))


    selectDropDownValuesForService =[
     "SecondaryPump_ATREN 1F Secondary Pump 01_OTCI Attareen",
    
      "SecondaryPump_ATREN 1F Secondary Pump 02_OTCI Attareen"
      
    ];

    intialValidation = (record,data)=>{
     

      let validationArray = []
      for (let [key, value] of Object.entries(record)) {
      //  if( patternValidator(key).exec(value) == null){

      //     validationArray.push(key)
      //   }
        if(key == 'equipmentName'){
          const equipmentTypeList = data.map(item => item.equipmentName)
          if(equipmentTypeList.indexOf(record.equipmentName) != equipmentTypeList.lastIndexOf(record.equipmentName))
          validationArray.push(key)
        }

        if(this.selectDropDownValues.client.find(value => value == record.client)==undefined && key=='client'){
            validationArray.push(key)
        }

        if(this.selectDropDownValues.deviceId.find(value => value == record.deviceId)==undefined && key=='deviceId'){
          validationArray.push(key)
        }

        if(this.selectDropDownValues.community.find(value => value.clientName == record.community && value.domain == record.client)==undefined && key=='community'){
          validationArray.push(key)
         }

         if(this.selectDropDownValues.equipmentType.find(value => value.equipName == record.equipmentType && value.domain == record.client)==undefined && key=='equipmentType'){
          validationArray.push(key)
         }

         if(this.selectDropDownValues.site.find(value => value.name == record.siteName && value.domain == record.client && value.ownerClientId == record.community )==undefined && key=='siteName'){
          validationArray.push(key)
         }
// !record.pointsData.split('@').every(item => this.selectDropDownValues.pointsData.map(e=>e.point)).includes(item) &&
         if(this.selectDropDownValues.pointsData.find(value => value.equipName == record.equipmentType && value.domain == record.client && record.pointsData.split('@').every(item =>value.point.includes(item)))==undefined && key=='pointsData'){
          validationArray.push(key)
         }
    }
      return validationArray
    }

    updateDataSourceWithValidation = (record,validationArray,action)=>{

      const dataSource = [...this.state.dataSource].map(obj => ({...obj,vaildationStatus:this.intialValidation(obj,[...this.state.dataSource])}));

       // update error count
       var errCount = {count:0,row:[]}
       dataSource.forEach(element => {
         if (element.vaildationStatus.length>0)  {errCount.count+=element.vaildationStatus.length
           errCount.row.push(dataSource.indexOf(element)+1)
         }
       });

      this.setState({
        dataSource:  dataSource,
        errCount : errCount
      });

     
    }
  
    handleDelete = (key) => {
      const dataSource = [...this.state.dataSource];
      this.setState({
        dataSource: dataSource.filter((item) => item.key !== key),
      });
    };
    handleAdd = () => {
      const { count, dataSource,errCount } = this.state;
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
        servingSpaceData : "",
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

      


      this.setState({
        dataSource: newData, 
      });

      localStorage.setItem('validatorData',JSON.stringify(newData));


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

        // title == 'client' || title == 'community' || title =='siteName' || title == 'equipmentName' || title =='equipmentType'
        let checkBeforeDownload = this.state.dataSource.filter(value => value.client ===''|| value.community ==='' || value.siteName === ''||value.equipmentName ===''||value.equipmentType === "")
        // console.log("null"+checkBeforeDownload);
        if (checkBeforeDownload.length>0){
          checkBeforeDownload = checkBeforeDownload.map(x=> this.state.dataSource.indexOf(x)+1)
          alert("Empty value at required fields on index :  \n"+checkBeforeDownload)
        }
        wb.SheetNames.push("sheet1");
        var rowData = [].concat(this.state.dataSource)
        var ws = XLSX.utils.json_to_sheet(rowData.map(({key,vaildationStatus, ...remainingAttrs}) => remainingAttrs));
        wb.Sheets["sheet1"] = ws;
        var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
          function s2ab(s) { 
            var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
            var view = new Uint8Array(buf);  //create uint8array as viewer
            for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
            return buf;    
          }
          saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'test.xlsx');
          // localStorage.removeItem('api')
}

    render() {
      const { dataSource } = this.state;

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
            selectDropDownValues : this.selectDropDownValues,
          }),
        };
      });
      return (
        <div style={{zIndex:"999",position:"absolute",marginTop:"115px",padding:"6px",width:"100%"}}>
          <div className="errCount" style={{"position":"absolute","marginLeft":"240px","marginTop":"-51px"}}> {this.state.errCount.count + " error index list : "}
          
              <Select type="primary" defaultValue={this.state.errCount.row[0]? this.state.errCount.row[0]:0}>
                {this.state.errCount.row.map((value)=> <Option key={value} value={value}>{value}</Option>)}
              </Select>
          </div>
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
            pagination={false} 
          />
        </div>
      );
    }
  }
      

export default EditableTable