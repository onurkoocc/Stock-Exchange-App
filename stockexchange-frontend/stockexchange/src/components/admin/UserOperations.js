import React, {useState, useEffect} from "react";
import  AdminService from "../../services/admin.service";

const UserOperations = () => {
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState("");
    const [updatePage, setUpdatePage] = useState(false);
    const [addPage,setAddPage] = useState(false);
    const userTmp ={
        id:null,
        name:null,
        surname:null,
        username: null,
        email:null,
        role:null,
        password:null,
    };
    const [userForm, setUserForm] = useState(userTmp);
    useEffect(() => {
        AdminService.getAllUsers().then(
            (data) => {
                setUsers(data);
            },
            (error) => {
                const errors =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setErrors(errors);
            }
        );
    }, [updatePage]);

    const onDelete = (userId) => {
        AdminService.deleteUser(userId).then(
            () => {
                window.location.reload();
            },
            (error) => {
                const errors =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setErrors(errors);
            }
        );
    };


    const onChangeName = event => {
        setUserForm({ ...userForm,name:event.target.value})
    }
    const onChangeSurname = event => {
        setUserForm({ ...userForm,surname:event.target.value})
    }
    const onChangeUsername = event => {
        setUserForm({ ...userForm,username:event.target.value})
    }
    const onChangeRole = event => {
        setUserForm({ ...userForm,role:event.target.value})
    }
    const onChangeEmail = event => {
        setUserForm({ ...userForm,email:event.target.value})
    }
    const onChangePassword = event => {
        setUserForm({ ...userForm,password:event.target.value})
    }

    const addUser = () => {
        AdminService.addUser(userForm.name,userForm.surname,userForm.username,userForm.email,userForm.role,userForm.password)
            .then(data => {
                setUserForm(userTmp);
                setAddPage(false);
                console.log(data);
            })
            .catch(e => {
                console.log(e);
            });
    };

    const updateUser = () => {

        AdminService.updateUser(userForm.id,userForm.name,userForm.surname,userForm.username,userForm.email,userForm.role)
            .then(data => {
                setUserForm(userTmp);
                setUpdatePage(false);
                console.log(data);
            })
            .catch(e => {
                console.log(e);
            });
    };
const newUpdateForm = (user) => {
    setUserForm(userTmp);
    setUserForm({ ...userForm,
        id:user.id,
        name:user.name,
        surname:user.surname,
        username:user.username,
        email:user.email,
        password:user.password,
        role:user.role.name,
    });
    setUpdatePage(true);
};

    const newAddForm = () => {
        setUserForm(userTmp);
        setAddPage(true);
    };

    return (
        <div className="container">

                    {!updatePage ? (
                        <div className="card">
            <h3 className="card-header text-center">Users</h3>
                    <div className="list-group-flush">
                {errors}
                        <div className="text-right">
                        <button onClick={newAddForm} className="btn btn-success" >
                            Add User
                        </button>
                        </div>
                        {addPage &&
                        <div className="card">
                            <div className="list-group-flush">
                                <form>
                        <table className="table">
                            <thead>
                            <tr>
                                <th>NAME</th>
                                <th>SURNAME</th>
                                <th>USERNAME</th>
                                <th>EMAİL</th>
                                <th>ROLE</th>
                                <th>PASSWORD</th>
                                <th>ADD</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td><input className="form-control input-sm" value={userForm.name} onChange={onChangeName}/></td>
                                <td><input className="form-control input-sm" value={userForm.surname} onChange={onChangeSurname}/></td>
                                <td><input className="form-control input-sm" value={userForm.username} onChange={onChangeUsername}/></td>
                                <td><input className="form-control input-sm" value={userForm.email} onChange={onChangeEmail}/></td>
                                <td><input className="form-control input-sm" value={userForm.role} onChange={onChangeRole}/></td>
                                <td><input className="form-control input-sm" value={userForm.password} onChange={onChangePassword}/></td>
                                <td><button className="btn btn-success" onClick={() => addUser()}>SAVE</button></td>
                            </tr>
                            </tbody>
                        </table>
                                </form>
                        </div>
                        </div>
                        }

                <table className="table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>SURNAME</th>
                        <th>USERNAME</th>
                        <th>EMAİL</th>
                        <th>ROLE</th>
                        <th>DELETE</th>
                        <th>UPDATE</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.surname}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role.name}</td>
                            <td><button className="btn btn-danger" onClick={() => onDelete(user.id)}>DELETE</button></td>
                            <td><button className="btn btn-primary" onClick={() => newUpdateForm(user)}>UPDATE</button></td>
                        </tr>
                    ))}

                    </tbody>
                        </table>



                    </div>
                        </div>
                ):
                    (
                        <div className="submit-form">
                            <div className="form-group">
                                <label htmlFor="id">ID</label>
                                <h1 id="id">{userForm.id}</h1>
                            </div>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                required
                                value={userForm.name}
                                onChange={onChangeName}
                                name="name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="surname">Surname</label>
                            <input
                                type="text"
                                className="form-control"
                                id="surname"
                                required
                                value={userForm.surname}
                                onChange={onChangeSurname}
                                name="surname"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                id="surname"
                                required
                                value={userForm.username}
                                onChange={onChangeUsername}
                                name="username"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="text"
                                className="form-control"
                                id="email"
                                required
                                value={userForm.email}
                                onChange={onChangeEmail}
                                name="email"
                            />
                        </div>

                            <div className="form-group">
                                <label htmlFor="role">Role</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="role"
                                    required
                                    value={userForm.role}
                                    onChange={onChangeRole}
                                    name="role"
                                />
                            </div>

                        <button onClick={()=>updateUser()} className="btn btn-success">
                            Save
                        </button>
                    </div>
                    )}

                    </div>

                        );
                        };
export default UserOperations;

