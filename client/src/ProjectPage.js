import React from 'react';

class ProjectPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {form1:true, form2:true, form3:true, form4:true};
        this.toggle2 = this.toggle.bind(this);
    }

    toggle(form){
        switch(form){
            case 1:
                this.setState({form1 : !this.state.form1});
            break;

            case 2:
                this.setState({form2 : !this.state.form2});
            break;

            case 3:
                this.setState({form3 : !this.state.form3});
            break;

            case 4:
                this.setState({form4 : !this.state.form4});
            break;
    
            default:
                return;
        }   
    }

    render(){
        return(
            <React.Fragment>
                <h1><u>Project Tree</u></h1>
                <div>
                    <h3 id="form1" onClick={() => this.toggle(1)}>Select Project {this.state.form1 ? "\u25BE" : "\u25B4"}</h3>
                    {this.state.form1 ? null : <SelectProjectForm />}
                    <h3 id="form2" onClick={() => this.toggle(2)}>Create Project {this.state.form2 ? "\u25BE" : "\u25B4"}</h3>
                    {this.state.form2 ? null : <CreateProjectForm />}
                    <h3 id="form3" onClick={() => this.toggle(3)}>Delete Project {this.state.form3 ? "\u25BE" : "\u25B4"}</h3>
                    {this.state.form3 ? null : <DeleteProjectForm />}
                    <h3 id="form4" onClick={() => this.toggle(4)}>Update Project {this.state.form4 ? "\u25BE" : "\u25B4"}</h3>
                    {this.state.form4 ? null : <UpdateProjectForm />}
                </div>
            </React.Fragment>
        )
    }
}

class CreateProjectForm extends React.Component{
    render()
    {
        return(
            <form>
                <label> Name of project<br /><input type='text' id="cp_Name" name="cp_Name"/></label><br/><br/>
                <label> Description of project<br /><textarea id="cp_Description" cols='30' rows='10' name="cp_Description"></textarea></label><br/>
                <br />
                <table>
                    <thead>
                        <tr>
                            <th colSpan="4"><u>Project Permisions</u></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td>Create</td>
                            <td>Delete</td>
                            <td>Update</td>
                        </tr>
                        <tr>
                            <td>Package Manager</td>
                            <td><input type="checkbox" id='cp_pm_Create' name="cp_pm_Create"/></td>
                            <td><input type="checkbox"  id='cp_pm_Delete' name="cp_pm_Delete"/></td>
                            <td><input type="checkbox" id='cp_pm_Update' name="cp_pm_Update"/></td>
                        </tr>
                        <tr>
                            <td>Responsible Person</td>
                            <td><input type="checkbox" id='cp_rp_Create' name="cp_rp_Create"/></td>
                            <td><input type="checkbox" id='cp_rp_Delete' name="cp_rp_Delete"/></td>
                            <td><input type="checkbox" id='cp_rp_Update' name="cp_rp_Update"/></td>
                        </tr>
                        <tr>
                            <td>Resource</td>
                            <td><input type="checkbox" id='cp_r_Create' name="cp_r_Create"/></td>
                            <td><input type="checkbox" id='cp_r_Delete' name="cp_r_Delete"/></td>
                            <td><input type="checkbox" id='cp_r_Update' name="cp_r_Update"/></td>
                        </tr>
                    </tbody>
                </table><br />
                <input type='submit' value='Submit'/>
            </form>
        )
    }
}

class SelectProjectForm extends React.Component{
    render()
    {
        return(
            <form>
                <label> ID of project<br /><input type="number" id="sp_id" name="sp_id"/></label><br/>
                <input type='submit' value='Submit' />
            </form>
        );
    }
}

class DeleteProjectForm extends React.Component{
    render(){
        return(
            <form>
                <label>Enter ID to delete:<br/><input type="number" id="dp_id" name="dp_id"/></label><br/>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

class UpdateProjectForm extends React.Component{
    render(){
        return(
            <form>
                <label>Enter ID to update:<br/><input type="number" id="up_id" name="up_id"/></label><br/>
                <label> Name of project<br /><input type='text' id="up_name" name="up_name"/></label><br/><br/>
                <label> Description of project<br /><textarea id="up_description" name="up_description" cols='30' rows='10'></textarea></label><br/>
                <br />
                <table>
                    <thead>
                        <tr>
                            <th colSpan="4"><u>Project Permisions</u></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td>Create</td>
                            <td>Delete</td>
                            <td>Update</td>
                        </tr>
                        <tr>
                            <td>Package Manager</td>
                            <td><input type="checkbox" id='up_pm_Create' name='up_pm_Create'/></td>
                            <td><input type="checkbox" id='up_pm_Delete' name='up_pm_Delete'/></td>
                            <td><input type="checkbox" id='up_pm_Update' name='up_pm_Update'/></td>
                        </tr>
                        <tr>
                            <td>Responsible Person</td>
                            <td><input type="checkbox" id='up_rp_Create' name='up_rp_Create'/></td>
                            <td><input type="checkbox" id='up_rp_Delete' name='up_rp_Delete'/></td>
                            <td><input type="checkbox" id='up_rp_Update' name='up_rp_Update'/></td>
                        </tr>
                        <tr>
                            <td>Resource</td>
                            <td><input type="checkbox" id='up_r_Create' name='up_r_Create'/></td>
                            <td><input type="checkbox" id='up_r_Delete' name='up_r_Delete'/></td>
                            <td><input type="checkbox" id='up_r_Update' name='up_r_Update'/></td>
                        </tr>
                    </tbody>
                </table><br />
                <input type='submit' value='Submit' />
            </form>
        );
    }
}


export default ProjectPage;

