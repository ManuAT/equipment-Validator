import React, { useContext, useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Table, Input, Button, Popconfirm, Form ,Dropdown,Menu } from 'antd';


const EditableContext = React.createContext(null);


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
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
// temp menu
    const menu = (
      <Menu>
        <Menu.Item key="1">1st menu item</Menu.Item>
        <Menu.Item key="2">2nd menu item</Menu.Item>
        <Menu.Item key="3">3rd menu item</Menu.Item>
      </Menu>
    );
  
    let childNode = children;

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
                message: `${title} is required.`,
              },
            ]}
          >
            <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            {/* <Dropdown overlay={menu} >
              <span ref={inputRef} style={{ userSelect: "none" }}>hover on Me</span>
            </Dropdown> */}
          </Form.Item>
        ) : (
          <div
            className="editable-cell-value-wrap"
            style={{
              paddingRight: 24,
            }}
            onClick={toggleEdit}
          >
            {children}
          </div>
        );
      }
    
      return <td {...restProps}>{childNode}</td>;
    };

class EditableTable extends React.Component {
    constructor(props) {
      super(props);
      this.columns = [
        {
          title: 'client',
          dataIndex: 'client',
          // width: '30%',
          editable: true,
        },
        {
          title: 'deviceId',
          dataIndex: 'deviceId',
          editable: true,
          
        },
        {
          title: 'community',
          dataIndex: 'community',
          editable: true,
        },
        {
          title: 'siteName',
          dataIndex: 'siteName',
          editable: true,
        },
        {
          title: 'equipmentName',
          dataIndex: 'equipmentName',
          editable: true,
        },
        {
          title: 'equipmentType',
          dataIndex: 'equipmentType',
          editable: true,
        },
        {
          title: 'assetCode',
          dataIndex: 'assetCode',
          editable: true,
        },
        {
          title: 'pointsData',
          dataIndex: 'pointsData',
          editable: true,
        },
        {
          title: 'roomsData',
          dataIndex: 'roomsData',
          editable: true,
        },
        {
          title: 'floorsData',
          dataIndex: 'floorsData',
          editable: true,
        },
        {
          title: 'commonAreaData',
          dataIndex: 'commonAreaData',
          editable: true,
        },
        {
          title: 'servingToData',
          dataIndex: 'servingToData',
          editable: true,
          width:'40%'
        },
        {
          title: 'servingByData',
          dataIndex: 'servingByData',
          editable: true,
          width:'40%'
        },
        {
          title: 'contractAccountNumber',
          dataIndex: 'contractAccountNumber',
          editable: true,
        },
        {
          title: 'premiseNo',
          dataIndex: 'premiseNo',
          editable: true,
        },
        {
          title: 'meterNumber',
          dataIndex: 'meterNumber',
          editable: true,
        },
        {
          title: 'operation',
          dataIndex: 'operation',
          render: (_, record) =>
            this.state.dataSource.length >= 1 ? (
              <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                <a>Delete</a>
              </Popconfirm>
            ) : null,
        },
      ];
      this.state = {
        dataSource:this.props.data.map(obj=> ({ ...obj, key: uuidv4() })),

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
        count: 1,
      };
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
        key: count,
        name: `Edward King ${count}`,
        age: '32',
        address: `London, Park Lane no. ${count}`,
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
    };
  
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
          }),
        };
      });
      return (
        <div>
          <Button
            onClick={this.handleAdd}
            type="primary"
            style={{
              marginBottom: 16,
            }}
          >
            Add a row
          </Button>
          <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={dataSource}
            columns={columns}
          />
        </div>
      );
    }
  }
      

export default EditableTable