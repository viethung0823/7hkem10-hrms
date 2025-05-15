import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCog, faHome, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Form, Button, ButtonGroup, Breadcrumb, InputGroup, Dropdown, Alert, Table } from '@themesberg/react-bootstrap';
import { useHistory } from 'react-router-dom';
import { apiService } from "../services/api";
import { Routes } from "../routes";

export default (props) => {
  const { title = "Job Title Management", showSearch = true, showSettings = true } = props;
  const [jobTitles, setJobTitles] = useState([]);
  const [filteredJobTitles, setFilteredJobTitles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchJobTitles = async () => {
      try {
        const data = await apiService.getJobTitles();
        console.log('API Response:', data);
        setJobTitles(data);
        setFilteredJobTitles(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching job titles:', error);
        setError(error.message || 'Failed to fetch job titles');
      }
    };

    fetchJobTitles();
  }, []);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);

    if (searchValue === '') {
      setFilteredJobTitles(jobTitles);
    } else {
      const filtered = jobTitles.filter(jobTitle =>
        jobTitle.name.toLowerCase().includes(searchValue) ||
        jobTitle.code.toLowerCase().includes(searchValue)
      );
      setFilteredJobTitles(filtered);
    }
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
            <Breadcrumb.Item active>Job Titles</Breadcrumb.Item>
          </Breadcrumb>
          <h4>{title}</h4>
        </div>
        <div className="btn-toolbar mb-2 mb-md-0">
          {showSettings && (
            <ButtonGroup>
              <Button
                variant="primary"
                size="sm"
                onClick={() => history.push(Routes.JobTitleNew.path)}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                New Job Title
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
          </Row>
        </div>
      )}

      <Table className="align-items-center table-flush" responsive>
        <thead className="thead-light">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Code</th>
            <th scope="col">Description</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobTitles.map(jobTitle => (
            <tr key={jobTitle.id}>
              <td>{jobTitle.id}</td>
              <td>{jobTitle.name}</td>
              <td>{jobTitle.code}</td>
              <td>{jobTitle.description}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => history.push(`${Routes.JobTitleDetail.path.replace(':id', jobTitle.id)}`)}
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