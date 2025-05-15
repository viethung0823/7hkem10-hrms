import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Card, Table, Form, Alert, Breadcrumb } from '@themesberg/react-bootstrap';
import { useHistory } from 'react-router-dom';
import { apiService } from "../services/api";
import { Routes } from "../routes";

export default () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await apiService.getEmployees();
        setEmployees(data);
        setFilteredEmployees(data);
      } catch (error) {
        setError('Failed to fetch employees');
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      const filtered = employees.filter(employee =>
        employee.name.toLowerCase().includes(value.toLowerCase()) ||
        employee.code.toLowerCase().includes(value.toLowerCase()) ||
        employee.email.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'string') return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Employees</Breadcrumb.Item>
            <Breadcrumb.Item active>View All Employees</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Employees</h4>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Button
            variant="primary"
            size="sm"
            className="me-2"
            onClick={() => history.push(Routes.EmployeeNew.path)}
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            New Employee
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card border="light" className="table-wrapper table-responsive shadow-sm">
        <Card.Body className="pt-0">
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search by name, code, or email..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </Form.Group>

          <Table hover className="user-table align-items-center">
            <thead>
              <tr>
                <th className="border-bottom">ID</th>
                <th className="border-bottom">Name</th>
                <th className="border-bottom">Code</th>
                <th className="border-bottom">Email</th>
                <th className="border-bottom">Phone</th>
                <th className="border-bottom">Gender</th>
                <th className="border-bottom">Join Date</th>
                <th className="border-bottom">Status</th>
                <th className="border-bottom">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(employee => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.code}</td>
                  <td>{employee.email}</td>
                  <td>{employee.workPhone}</td>
                  <td>{employee.gender}</td>
                  <td>{formatDate(employee.dateJoin)}</td>
                  <td>{employee.status || 'Active'}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => history.push(`${Routes.EmployeeDetail.path.replace(':id', employee.id)}`)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};
