const RB = ReactBootstrap;
const { Alert, Card, Button, Table } = RB;

const firebaseConfig = {
    apiKey: "AIzaSyDzr5obysa-EIOVAKBzJZz16g90GPBv64U",
    authDomain: "web2567-15671.firebaseapp.com",
    projectId: "web2567-15671",
    storageBucket: "web2567-15671.firebasestorage.app",
    messagingSenderId: "128233299450",
    appId: "1:128233299450:web:181f75710d5ae59b64d843"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

class App extends React.Component {
    title = (
        <Alert variant="info" className="text-center">
            <b>Work6 :</b> Firebase
        </Alert>
    );

    footer = (
        <div className="text-center">
            By 653380205-4 Pathanin Khuhathong <br />
            College of Computing, Khon Kaen University
        </div>
    );

    state = {
        scene: 0,
        user: null,
        students: [],
        stdid: "",
        stdtitle: "",
        stdfname: "",
        stdlname: "",
        stdemail: "",
        stdphone: "",
    };

    constructor() {
        super();
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user: user.toJSON() });
            } else {
                this.setState({ user: null });
            }
        });
    }

    google_login() {
        var provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope("profile");
        provider.addScope("email");
        firebase.auth().signInWithPopup(provider);
    }

    google_logout() {
        if (confirm("Are you sure?")) {
            firebase.auth().signOut();
        }
    }

    readData() {
        db.collection("students").get().then((querySnapshot) => {
            var stdlist = [];
            querySnapshot.forEach((doc) => {
                stdlist.push({ id: doc.id, ...doc.data() });
            });
            this.setState({ students: stdlist });
        });
    }

    autoRead() {
        db.collection("students").onSnapshot((querySnapshot) => {
            var stdlist = [];
            querySnapshot.forEach((doc) => {
                stdlist.push({ id: doc.id, ...doc.data() });
            });
            this.setState({ students: stdlist });
        });
    }

    insertData() {
        db.collection("students").doc(this.state.stdid).set({
            title: this.state.stdtitle,
            fname: this.state.stdfname,
            lname: this.state.stdlname,
            phone: this.state.stdphone,
            email: this.state.stdemail,
        });
    }

    edit(std) {
        this.setState({
            stdid: std.id,
            stdtitle: std.title,
            stdfname: std.fname,
            stdlname: std.lname,
            stdemail: std.email,
            stdphone: std.phone,
        });
    }

    delete(std) {
        if (confirm("Are you sure you want to delete this record?")) {
            db.collection("students").doc(std.id).delete();
        }
    }

    render() {
        return (
            <Card className="m-3">
                <Card.Header>{this.title}</Card.Header>
                <LoginBox user={this.state.user} app={this} />
                <Card.Body>
                    <div className="d-flex justify-content-between mb-3">
                        <Button onClick={() => this.readData()}>Read Data</Button>
                        <Button onClick={() => this.autoRead()}>Auto Read</Button>
                    </div>
                    <StudentTable data={this.state.students} app={this} />
                </Card.Body>
                <Card.Footer>
                    <b>เพิ่ม/แก้ไขข้อมูล นักศึกษา :</b>
                    <div className="mb-3">
                        <TextInput label="ID" app={this} value="stdid" style={{ width: 120 }} />
                        <TextInput label="คำนำหน้า" app={this} value="stdtitle" style={{ width: 100 }} />
                        <TextInput label="ชื่อ" app={this} value="stdfname" style={{ width: 120 }} />
                        <TextInput label="สกุล" app={this} value="stdlname" style={{ width: 120 }} />
                        <TextInput label="Email" app={this} value="stdemail" style={{ width: 150 }} />
                        <TextInput label="Phone" app={this} value="stdphone" style={{ width: 120 }} />
                    </div>
                    <Button onClick={() => this.insertData()} variant="primary">Save</Button>
                </Card.Footer>
                <Card.Footer className="text-center">{this.footer}</Card.Footer>
            </Card>
        );
    }
}

function LoginBox(props) {
    const u = props.user;
    const app = props.app;
    if (!u) {
        return <div><Button onClick={() => app.google_login()}>Login with Google</Button></div>;
    } else {
        return <div className="text-center">
            <img src={u.photoURL} alt="User Avatar" className="rounded-circle" width="50" height="50" />
            <p>{u.email}</p>
            <Button variant="danger" onClick={() => app.google_logout()}>Logout</Button>
        </div>;
    }
}

function StudentTable({ data, app }) {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>รหัส</th>
                    <th>คำนำหน้า</th>
                    <th>ชื่อ</th>
                    <th>สกุล</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {data.map((s) => (
                    <tr key={s.id}>
                        <td>{s.id}</td>
                        <td>{s.title}</td>
                        <td>{s.fname}</td>
                        <td>{s.lname}</td>
                        <td>{s.email}</td>
                        <td>
                            <EditButton std={s} app={app} />
                            <DeleteButton std={s} app={app} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

function EditButton({ std, app }) {
    return <Button variant="warning" size="sm" onClick={() => app.edit(std)}>แก้ไข</Button>;
}

function DeleteButton({ std, app }) {
    return <Button variant="danger" size="sm" onClick={() => app.delete(std)}>ลบ</Button>;
}

function TextInput({ label, app, value, style }) {
    return (
        <div className="mb-2">
            <label className="form-label">{label}:</label>
            <input
                className="form-control"
                style={style}
                value={app.state[value]}
                onChange={(ev) => {
                    var s = {};
                    s[value] = ev.target.value;
                    app.setState(s);
                }}
            />
        </div>
    );
}

const container = document.getElementById("myapp");
const root = ReactDOM.createRoot(container);
root.render(<App />);
