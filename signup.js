import React, { Component } from "react";
import axiosInstance from "../axiosApi";



class Signup extends Component{
    constructor(props){
        super(props);
        this.state = {
            firstname: "",
            lastname: "",
            affiliation: "",
            position: "",
            username: "",
            email:"",
            password: "",
            errors:""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    //('first_name', 'last_name', 'affiliation', 'position', 'email', 'username', 'password')
    async handleSubmit(event) {
        event.preventDefault();
        try {
            const response = await axiosInstance.post('/user/create/', {
                first_name: this.state.firstname,
                last_name: this.state.lastname,
                affiliation: this.state.affiliation,
                position: this.state.position,
                username: this.state.username,
                email: this.state.email,
                password: this.state.password
            });
            return response;
        } catch (error) {
            console.log(error.stack);
            this.setState({
                errors:error.response.data
            });
        }
    }

    render() {
        return (
            
            <div>
                {/* <div class = "newTitle">
                    Signup for Research For All
                </div> */}
                <h1 class="display-4 text-center">Signup for Research For All</h1>
                <form>
                    <div class = "form-group">

                    
                        <div class = "row">
                            <div class = "col">
                                <label for="firstname">First Name</label>
                                <input name="firstname" id="firstname" type = "text" class = "form-control" value={this.state.firstname} onChange={this.handleChange} placeholder = "First name"/>
                                { this.state.errors.firstname ? this.state.errors.firstname : null}
                            </div>
                            <div class = "col">
                                <label for="lastname">Last Name</label>
                                <input name="lastname" id = "lastname" type = "text" class = "form-control" value={this.state.lastname} onChange={this.handleChange} placeholder = "Last name"/>
                                { this.state.errors.lastname ? this.state.errors.lastname : null}
                            </div>
                        </div>
                        <div class = "row">
                            <div class = "col">
                                <label for="affiliation">Affiliation</label>
                                <input name="affiliation" id ="affiliation" type = "text" class = "form-control" value={this.state.affiliation} onChange={this.handleChange} placeholder = "Name of university, laboratory, etc."/>
                                { this.state.errors.affiliation ? this.state.errors.affiliation : null}
                            </div>
                            <div class = "col">
                                <label for="position">Position</label>
                                <input name="position" id ="position" type = "text" class = "form-control" value={this.state.position} onChange={this.handleChange} placeholder = "Undergraduate Student, Graduate Student, Professor, Other"/>
                                { this.state.errors.position ? this.state.errors.position : null}
                            </div>
                        </div>

                        <div class = "row">
                            <div class = "col">
                                <label for="email">Email</label>
                                <input name="email" id ="email" type = "email" class = "form-control" value={this.state.email} onChange={this.handleChange} placeholder = "Email address"/>
                                { this.state.errors.email ? this.state.errors.email : null}
                            </div>
                            <div class = "col">
                                <label for="password">Password</label>
                                <input name="password" id ="password" type = "password" class = "form-control" value={this.state.password} onChange={this.handleChange} placeholder = "Password"/>
                                { this.state.errors.email ? this.state.errors.email : null}
                            </div>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary">Submit</button>
                </form>
                    {/* <form>
                    <p>
                        First Name
                        <input name="firstname" type="text" value={this.state.firstname} onChange={this.handleChange}/>
                        { this.state.errors.firstname ? this.state.errors.firstname : null}
                    </p>
                    <p>
                        Last Name:
                        <input name="lastname" type="text" value={this.state.lastname} onChange={this.handleChange}/>
                        { this.state.errors.lastname ? this.state.errors.lastname : null}
                    </p>
                    <p>
                        Affiliation:
                        <input name="affiliation" type="text" value={this.state.affiliation} onChange={this.handleChange}/>
                        { this.state.errors.affiliation ? this.state.errors.affiliation : null}
                    </p>
                    <p>
                        Position:
                        <input name="position" type="text" value={this.state.position} onChange={this.handleChange}/>
                        { this.state.errors.position ? this.state.errors.position : null}
                    </p>
                    <p>
                        Username:
                        <input name="username" type="text" value={this.state.username} onChange={this.handleChange}/>
                        { this.state.errors.username ? this.state.errors.username : null}
                    </p>
                    <p>
                        Email:
                        <input name="email" type="email" value={this.state.email} onChange={this.handleChange}/>
                        { this.state.errors.email ? this.state.errors.email : null}
                    </p>
                    <p>
                        Password:
                        <input name="password" class="form-control-plaintext" type="password" value={this.state.password} onChange={this.handleChange}/>
                        { this.state.errors.password ? this.state.errors.password : null}
                    </p>
                    <input type="submit" value="Submit"/>
                </form> */}
            </div>
        )
    }
}
export default Signup;