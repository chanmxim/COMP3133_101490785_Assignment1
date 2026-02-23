import User from "../../models/User.js"
import Employee from "../../models/Employee.js"

import { v2 as cloudinary } from 'cloudinary';
import bcrypt from "bcrypt"

const resolvers = {
    Query: {
        login: async (_, {usernameOrEmail, password}) => {
            const user = await User.findOne({
                $or: [{email: usernameOrEmail}, {username: usernameOrEmail}]
            });
            if (!user) {
                throw new Error("User not found")
            }

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid){
                throw new Error("Invalid credentials")
            } 

            return user;
        },

        getAllEmployees: async () => {
            return await Employee.find({})
        },

        searchEmployeeByEid: async (_, {id}) => {
            const employee = await Employee.findById(id);
            if (!employee){
                throw new Error("Employee not found")
            }

            return employee
        },

        searchEmployeeByDesignationOrDepartment: async (_, {designation, department}) => {
            let employees = []

            if (designation || department){
            employees = await Employee.find({
                $or: [
                    {designation: designation},
                    {department: department}
                ]
            })
            }

            return employees
        }
    },

    Mutation: {
        signup: async (_, {username, email, password}) => {
            try {
                const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS) || 10)
                const hashedPassword = await bcrypt.hash(password, salt);

                const newUser = new User({username, email, password: hashedPassword})
                const savedUser = await newUser.save()
                
                return savedUser

            } catch(e){
                throw new Error(e.message)
            }
        },

        addNewEmployee: async (_, args) => {
            try {
                let photoUrl = null

                if (args.employee_photo) {
                    // Upload to Cloudinary
                    const uploadResponse = await cloudinary.uploader.upload(args.employee_photo, {
                        folder: 'comp3133_employees'
                    });
                    
                    // get URL
                    photoUrl = uploadResponse.secure_url;
                }

                const newEmployee = new Employee({...args, employee_photo: photoUrl})
                const savedEmployee = await newEmployee.save()

                return savedEmployee

            } catch(e){
                throw new Error(e.message)
            }
        },

        updateEmployeeByEid: async (_, args) => {
            const {id, ...updateData} = args

            try{
                const updatedEmployee = await Employee.findByIdAndUpdate(
                    id,
                    updateData,
                    {new: true, runValidators: true}
                )
                if (!updatedEmployee){
                    throw new Error("Employee not found")
                }

                return updatedEmployee

            } catch(e){
                throw new Error(e.message)
            }
        },

        deleteEmployeeByEid: async (_, {id}) => {
            const deleted = await Employee.findByIdAndDelete(id)
            if (!deleted){
                throw new Error("Employee not found")
            }

            return "Employee deleted"
        }
    }
}

export default resolvers