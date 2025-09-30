
import bcrypt from 'bcrypt'
import { User } from '../Model/usermodel.js';


export const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const existuser = await User.findOne({ email })
        if (existuser) {
            return res.status(404).json({ message: 'This email is already exist' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ username, email, password: hashedPassword, role });
        newUser.save()

        res.status(201).json({
            message: "User registered successfully",
            newUser
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const userlogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const loginuser = await User.findOne({ email, role: 'user' });
        if (!loginuser) {
            return res.status(400).json({ message: 'This user not registered' });
        }

        const match = await bcrypt.compare(password, loginuser.password);
        if (!match) {
            return res.status(400).json({ message: 'Password is not match' });
        }
        req.session.user = {
            _id: loginuser._id,
            role: 'user'
        };

        if (loginuser.status === 'Enable') {
            res.status(200).json({ message: "User successfully logged in", user: loginuser });
        } else {
            res.status(403).json({ message: "User is disabled" });
        }

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const adminlogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const adminuser = await User.findOne({ email, role: 'admin' });
        if (!adminuser) {
            return res.status(400).json({ message: 'This admin is not registered' });
        }
        const match = await bcrypt.compare(password, adminuser.password);
        if (!match) {
            return res.status(400).json({ message: 'Password does not match' });
        }
        if (match) {
            req.session.Admin = {
                id: adminuser._id,
                role: 'admin'
            }
            return res.status(200).json({
                message: "Admin successfully logged"
            });
        }

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const allusers = await User.find({ role: 'user' })
        res.send(allusers)
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}


export const getAllUsersbyid = async (req, res) => {
    try {
        const usersid = req.params.id
        const allusersid = await User.findById(usersid)
        res.send(allusersid)
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const enabledisableuser = async (req, res) => {
    try {
        const userId = req.params.id
        const updateuser = await User.findByIdAndUpdate(userId, { status: 'Disable' }, { new: true })
        res.send(updateuser)
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const enableUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(userId,{ status: "Enable" },{ new: true });
    res.send( updatedUser );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const updateProfileById = async (req, res) => {
  try {
    const { id } = req.params; 
    const { username, email, password } = req.body;

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;

   
    const updatedUser = await User.findByIdAndUpdate(id,{ $set: updateData },{ new: true})

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      user: updatedUser,
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const userLogout = (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ success: false, message: "Logout failed" });
      }
      return res.status(200).json({ success: true, message: "logout successful" });
    });
  } else {
    return res.status(500).json({ success: true, message: "No active session" });
  }
};