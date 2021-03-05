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
                Signup
                <form onSubmit={this.handleSubmit}>
                    <label>
                        First Name:
                        <input name="firstname" type="text" value={this.state.firstname} onChange={this.handleChange}/>
                        { this.state.errors.firstname ? this.state.errors.firstname : null}
                    </label>
                    <label>
                        Last Name:
                        <input name="lastname" type="text" value={this.state.lastname} onChange={this.handleChange}/>
                        { this.state.errors.lastname ? this.state.errors.lastname : null}
                    </label>
                    <label>
                        Affiliation:
                        <input name="affiliation" type="text" value={this.state.affiliation} onChange={this.handleChange}/>
                        { this.state.errors.affiliation ? this.state.errors.affiliation : null}
                    </label>
                    <label>
                        Position:
                        <input name="position" type="text" value={this.state.position} onChange={this.handleChange}/>
                        { this.state.errors.position ? this.state.errors.position : null}
                    </label>
                    <label>
                        Username:
                        <input name="username" type="text" value={this.state.username} onChange={this.handleChange}/>
                        { this.state.errors.username ? this.state.errors.username : null}
                    </label>
                    <label>
                        Email:
                        <input name="email" type="email" value={this.state.email} onChange={this.handleChange}/>
                        { this.state.errors.email ? this.state.errors.email : null}
                    </label>
                    <label>
                        Password:
                        <input name="password" type="password" value={this.state.password} onChange={this.handleChange}/>
                        { this.state.errors.password ? this.state.errors.password : null}
                    </label>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
        )
    }
}
export default Signup;