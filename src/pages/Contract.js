import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCog, faHome, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Form, Button, ButtonGroup, Breadcrumb, InputGroup, Dropdown, Alert, Table } from '@themesberg/react-bootstrap';
import { useHistory } from 'react-router-dom';
import { apiService } from "../services/api";
import { Routes } from "../routes";

export default (props) => {
  const { title = "Contract Management", showSearch = true, showSettings = true } = props;
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const data = await apiService.getContracts();
        console.log('API Response:', data);
        setContracts(data);
        setFilteredContracts(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching contracts:', error);
        setError(error.message || 'Failed to fetch contracts');
      }
    };

    fetchContracts();
  }, []);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    if (searchValue === '') {
      setFilteredContracts(contracts);
    } else {
      const filtered = contracts.filter(contract =>
        contract.name.toLowerCase().includes(searchValue) ||
        contract.code.toLowerCase().includes(searchValue)
      );
      setFilteredContracts(filtered);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatSalary = (salary) => {
    if (!salary) return 'N/A';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(salary);
  };

  return (
    <>
      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}

      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item active>Contracts</Breadcrumb.Item>
          </Breadcrumb>
          <h4>{title}</h4>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          {showSettings && (
            <ButtonGroup>
              <Button
                variant="primary"
                size="sm"
                onClick={() => history.push(Routes.ContractNew.path)}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                New Contract
              </Button>
            </ButtonGroup>
          )}
        </div>
      </div>

      {showSearch && (
        <div className="table-settings mb-4">
          <Row className="justify-content-between align-items-center">
            <Col xs={8} md={6} lg={3} xl={4}>
              <InputGroup>
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by name or code"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </InputGroup>
            </Col>
            {/* <Col xs={4} md={2} xl={1} className="ps-md-0 text-end">
              <Dropdown as={ButtonGroup}>
                <Dropdown.Toggle split as={Button} variant="link" className="text-dark m-0 p-0">
                  <span className="icon icon-sm icon-gray">
                    <FontAwesomeIcon icon={faCog} />
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-xs dropdown-menu-right">
                  <Dropdown.Item className="fw-bold text-dark">Show</Dropdown.Item>
                  <Dropdown.Item className="d-flex fw-bold">
                    10 <span className="icon icon-small ms-auto"><FontAwesomeIcon icon={faCheck} /></span>
                  </Dropdown.Item>
                  <Dropdown.Item className="fw-bold">20</Dropdown.Item>
                  <Dropdown.Item className="fw-bold">30</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col> */}
          </Row>
        </div>
      )}

      <Table className="align-items-center table-flush" responsive>
        <thead className="thead-light">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Code</th>
            <th scope="col">Start Date</th>
            <th scope="col">End Date</th>
            <th scope="col">Salary</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredContracts.map(contract => (
            <tr key={contract.id}>
              <td>{contract.id}</td>
              <td>{contract.name}</td>
              <td>{contract.code}</td>
              <td>{formatDate(contract.dateFrom)}</td>
              <td>{formatDate(contract.dateTo)}</td>
              <td>{formatSalary(contract.salary)}</td>
              <td>{contract.status?.value || 'N/A'}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => history.push(`${Routes.ContractDetail.path.replace(':id', contract.id)}`)}
                >
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};