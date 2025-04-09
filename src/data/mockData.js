const employeeList = [
    {
        "id": 1,
        "name": "John Doe",
        "code": "EMP001",
        "email": "john.doe@example.com",
        "workPhone": "123-456-7890",
        "gender": "MALE",
        "status": {
          "additionalProp1": "Active"
        },
        "dateJoin": "2023-01-15",
        "dateLeft": "",
        "country": "USA",
        "idNumber": "A1234567",
        "idDate": "2023-01-01",
        "idAddress": "123 Main St",
        "birthday": "1990-05-20",
        "placeOfBirth": "New York",
        "permanentAddress": "456 Elm St",
        "currentAddress": "789 Maple Ave",
        "passport": "P1234567",
        "maritalStatus": {
          "additionalProp1": "Single"
        },
        "emergencyContact": "Jane Doe",
        "emergencyPhone": "987-654-3210",
        "socialInsuranceCode": "S1234567",
        "taxCode": "T1234567",
        "religion": "None",
        "company": 1,
        "department": 1,
        "jobPosition": 1,
        "jobTitle": 1,
        "province": 1,
        "district": 1,
        "ward": 1,
        "user": 1,
        "manager": 1,
        "isUnion": true
      },
      {
        "id": 2,
        "name": "Jane Smith",
        "code": "EMP002",
        "email": "jane.smith@example.com",
        "workPhone": "321-654-0987",
        "gender": "FEMALE",
        "status": {
          "additionalProp1": "Active"
        },
        "dateJoin": "2022-06-10",
        "dateLeft": "",
        "country": "USA",
        "idNumber": "B7654321",
        "idDate": "2022-06-01",
        "idAddress": "321 Oak St",
        "birthday": "1985-11-30",
        "placeOfBirth": "Los Angeles",
        "permanentAddress": "654 Pine St",
        "currentAddress": "987 Cedar Ave",
        "passport": "P7654321",
        "maritalStatus": {
          "additionalProp1": "Married"
        },
        "emergencyContact": "John Smith",
        "emergencyPhone": "654-321-0987",
        "socialInsuranceCode": "S7654321",
        "taxCode": "T7654321",
        "religion": "None",
        "company": 2,
        "department": 2,
        "jobPosition": 2,
        "jobTitle": 2,
        "province": 2,
        "district": 2,
        "ward": 2,
        "user": 2,
        "manager": 2,
        "isUnion": false
      }
];

const contractList = [
    {
      "id": 9007199254740991,
      "name": "string",
      "code": "string",
      "dateFrom": "2025-04-09",
      "dateTo": "2025-04-09",
      "salary": "string",
      "status": {
        "additionalProp1": "string",
        "additionalProp2": "string",
        "additionalProp3": "string"
      },
      "employee": 9007199254740991,
      "contractType": 9007199254740991,
      "jobPosition": 9007199254740991,
      "jobTitle": 9007199254740991,
      "department": 9007199254740991,
      "company": 9007199254740991
    }
  ]

  const contractTypeList = [
    {
      "id": 9007199254740991,
      "name": "string",
      "code": "string",
      "isUnlimited": true,
      "isProbationaryContract": true
    }
  ]

  const hrDepartments = [
    {
      "id": 9007199254740991,
      "name": "string",
      "code": "string",
      "dateFrom": "2025-04-09",
      "dateTo": "2025-04-09",
      "salary": "string",
      "status": {
        "additionalProp1": "string",
        "additionalProp2": "string",
        "additionalProp3": "string"
      },
      "employee": 9007199254740991,
      "contractType": 9007199254740991,
      "jobPosition": 9007199254740991,
      "jobTitle": 9007199254740991,
      "department": 9007199254740991,
      "company": 9007199254740991
    }
  ]

export {
    employeeList,
    contractList
};