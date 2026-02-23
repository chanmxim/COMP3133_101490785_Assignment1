# Employee Management App (COMP3133 Assignment 1)

A Employee Management application implements **GraphQL**

---

## Instructions to Run Locally

1. **Clone the repository**  

2. **Navigate to the folder**

3. **Start the application**
```bash
npm run start
```
---

**Troubleshooting**  
- If there are any errors, they are most likely related to the database or cloudinary connection.  
- If the app cannot connect to the provided MongoDB Atlas, replace the connection string in `.env` with your own MongoDB Atlas URI.  
- If the app cannot connect to the provided cloudinary account, replace the CLOUDINARY_URL in `.env` with your own.  
- Ensure that a database named `comp3133_101490785_Assigment1` exists in your MongoDB cluster.