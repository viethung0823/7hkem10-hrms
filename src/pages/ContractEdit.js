import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Button, Form, Card, Alert, Breadcrumb } from '@themesberg/react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { apiService } from "../services/api";
import { Routes } from "../routes";

export default () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    dateFrom: '',
    dateTo: '',
    salary: '',
    status: { value: 'ACTIVE' },
    employee: '',
    contractType: '',
    jobPosition: '',
    jobTitle: '',
    department: '',
    company: ''
  });

  const [relatedData, setRelatedData] = useState({
    employees: [],
    contractTypes: [],
    jobPositions: [],
    jobTitles: [],
    departments: [],
    companies: []
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching contract with ID:', id);

        // Fetch all related data
        const [
          contractData,
          employees,
          contractTypes,
          jobPositions,
          jobTitles,
          departments,
          companies
        ] = await Promise.all([
          apiService.getContract(id),
          apiService.getEmployees(),
          apiService.getContractTypes(),
          apiService.getJobPositions(),
          apiService.getJobTitles(),
          apiService.getDepartments(),
          apiService.getCompanies()
        ]);

        console.log('Contract data:', contractData);

        // Set related data
        setRelatedData({
          employees,
          contractTypes,
          jobPositions,
          jobTitles,
          departments,
          companies
        });

        // Set form data
        const formattedData = {
          name: contractData.name || '',
          code: contractData.code || '',
          dateFrom: contractData.dateFrom ? contractData.dateFrom.split('T')[0] : '',
          dateTo: contractData.dateTo ? contractData.dateTo.split('T')[0] : '',
          salary: contractData.salary || '',
          status: contractData.status || { value: 'ACTIVE' },
          employee: contractData.employee || '',
          contractType: contractData.contractType || '',
          jobPosition: contractData.jobPosition || '',
          jobTitle: contractData.jobTitle || '',
          department: contractData.department || '',
          company: contractData.company || ''
        };
        console.log('Formatted form data:', formattedData);
        setFormData(formattedData);
      } catch (error) {
        console.error('Detailed error:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          stack: error.stack
        });
        setError(error.response?.data?.message || error.message || 'Failed to fetch data');
      }
    };

    if (id) {
      fetchData();
    } else {
      console.error('No contract ID provided');
      setError('No contract ID provided');
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await apiService.updateContract(id, formData);
      setSuccess('Contract updated successfully!');
      setTimeout(() => {
        history.push(Routes.Contract.path);
      }, 2000);
    } catch (error) {
      console.error('Update error:', error);
      if (error.response?.data?.fieldErrors) {
        const fieldErrors = error.response.data.fieldErrors;
        setError(fieldErrors.map(err => `${err.property}: ${err.message}`).join(', '));
      } else {
        setError(error.message || 'Failed to update contract');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'status') {
      setFormData(prev => ({
        ...prev,
        status: { value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-md-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Contracts</Breadcrumb.Item>
            <Breadcrumb.Item active>Edit Contract</Breadcrumb.Item>
          </Breadcrumb>
          <h4>Edit Contract</h4>
        </div>
      </div>

      <Row>
        <Col xs={12} xl={8}>
          <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-4">Contract Information</h5>
              <Form onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group id="name">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter contract name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group id="code">
                      <Form.Label>Code</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="Enter contract code"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group id="dateFrom">
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        required
                        type="date"
                        name="dateFrom"
                        value={formData.dateFrom}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group id="dateTo">
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="dateTo"
                        value={formData.dateTo}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group id="salary">
                      <Form.Label>Salary</Form.Label>
                      <Form.Control
                        required
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        placeholder="Enter salary"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group id="status">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        required
                        name="status"
                        value={formData.status.value}
                        onChange={handleChange}
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <h5 className="mb-4 mt-4">Related Information</h5>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group id="employee">
                      <Form.Label>Employee</Form.Label>
                      <Form.Select
                        required
                        name="employee"
                        value={formData.employee}
                        onChange={handleChange}
                      >
                        <option value="">Select Employee</option>
                        {relatedData.employees.map(emp => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group id="contractType">
                      <Form.Label>Contract Type</Form.Label>
                      <Form.Select
                        required
                        name="contractType"
                        value={formData.contractType}
                        onChange={handleChange}
                      >
                        <option value="">Select Contract Type</option>
                        {relatedData.contractTypes.map(type => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group id="jobPosition">
                      <Form.Label>Job Position</Form.Label>
                      <Form.Select
                        required
                        name="jobPosition"
                        value={formData.jobPosition}
                        onChange={handleChange}
                      >
                        <option value="">Select Job Position</option>
                        {relatedData.jobPositions.map(pos => (
                          <option key={pos.id} value={pos.id}>
                            {pos.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group id="jobTitle">
                      <Form.Label>Job Title</Form.Label>
                      <Form.Select
                        required
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                      >
                        <option value="">Select Job Title</option>
                        {relatedData.jobTitles.map(title => (
                          <option key={title.id} value={title.id}>
                            {title.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group id="department">
                      <Form.Label>Department</Form.Label>
                      <Form.Select
                        required
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                      >
                        <option value="">Select Department</option>
                        {relatedData.departments.map(dept => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group id="company">
                      <Form.Label>Company</Form.Label>
                      <Form.Select
                        required
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                      >
                        <option value="">Select Company</option>
                        {relatedData.companies.map(comp => (
                          <option key={comp.id} value={comp.id}>
                            {comp.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="mt-3">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Contract'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};