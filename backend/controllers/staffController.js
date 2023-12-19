const User = require("../models/User");
const Staff = require("../models/Staff");

exports.addNewEmployee = async (req, res) => {
  const { userId, job, jobPosition, staffInfo } = req.body;
  //   if (!userId || !job || !jobPosition || !role) {
  if (!userId || !job || !jobPosition) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingStaff = await Staff.findOne({ staff: userId });

  const user = await User.findById({ _id: userId });
  user.password = undefined;

  if (existingStaff) {
    return res.status(400).json({ message: "Staff member already exist" });
  }

  if (!existingStaff) {
    const staff = await Staff.create({
      staff: userId,
      job,
      jobPosition: jobPosition,
      staffInfo: user,
      //   role
    });

    const newStaff = await Staff.findById({ _id: staff._id }).populate("staff");
    // console.log("newStaff:", newStaff);

    if (newStaff) {
      await User.findByIdAndUpdate(
        { _id: newStaff.staff._id },
        { role: newStaff?.jobPosition, isStaff: true },
        { new: true }
      );

      res.status(201).json({ message: `New staff member created` });
    } else {
      res
        .status(400)
        .json({ message: "New staff member not created ! There is an error" });
    }
  }
};

// get all staff members
exports.getStaffMembers = async (req, res) => {
  const staffmembers = await Staff.find().populate("staff");

  if (staffmembers) {
    res.status(201).json(staffmembers);
  } else {
    res.status(400).json({ message: "No staff member found !" });
  }
};

// get single staff member
exports.getSingleStaffMember = async (req, res) => {
  const { staffId } = req.body;

  const staffmember = await Staff.findById({ _id: staffId }).populate("staff");

  if (staffmember) {
    res.status(201).json(staffmember);
  } else {
    res.status(400).json({ message: "No staff member found !" });
  }
};

// change status staff member
exports.changeStaffMemberStatus = async (req, res) => {
  const { staffId, staffStatus } = req.body;

  if (!staffId || !staffStatus) {
    res.status(400).json({ message: "all fields are required !" });
  }

  const staffMember = await Staff.findById({ _id: staffId });
  const user = await User.findById({ _id: updateStaff.staff._id });
  if (staffMember) {
    const updateStaff = await Staff.findByIdAndUpdate(
      { _id: staffMember._id },
      { status: staffStatus },
      { new: true }
    );

    if (
      (updateStaff && updateStaff.status === "suspended") ||
      updateStaff.status === "fired"
    ) {
      await User.findByIdAndUpdate(
        { _id: updateStaff.staff._id },
        { role: updateStaff.status, isStaff: false },
        { new: true }
      );
    } else {
      const user = await User.findById({ _id: updateStaff.staff._id });
      await User.findByIdAndUpdate(
        { _id: updateStaff.staff._id },
        {
          role: updateStaff.jobPosition,
          isStaff: true,
          // staffInfo: user,
        },
        { new: true }
      );
    }

    if (updateStaff) {
      res.status(201).json(updateStaff);
    } else {
      res.status(400).json({ message: "No staff member found !" });
    }
  }
};
// change status staff member
exports.changeJobPositionMemberStatus = async (req, res) => {
  const { staffId, newJobPosition } = req.body;

  if (!staffId || !newJobPosition) {
    res.status(400).json({ message: "all fields are required !" });
  }

  const staffMember = await Staff.findById({ _id: staffId });

  if (staffMember) {
    const updateStaff = await Staff.findByIdAndUpdate(
      { _id: staffMember._id },
      { jobPosition: newJobPosition },
      { new: true }
    );

    if (updateStaff) {
      await User.findByIdAndUpdate(
        { _id: updateStaff.staff._id },
        { role: updateStaff.jobPosition },
        { new: true }
      );
    }

    if (updateStaff) {
      res.status(201).json(updateStaff);
    } else {
      res.status(400).json({ message: "No staff member found !" });
    }
  }
};

// Searh staff member
// For chat  : get or Search users
exports.getAndSearchStaff = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          {
            "staffInfo.first_name": { $regex: req.query.search, $options: "i" },
          },
          {
            "staffInfo.last_name": { $regex: req.query.search, $options: "i" },
          },
        ],
      }
    : {};
  //   $ne: req.user._id : le user qui fait les recherce n'appartra pas dans le resultat
  const staffs = await Staff.find(keyword).find({
    staff: { $ne: req.user._id },
  });
  // .populate("staff");
  res.status(200).json(staffs);
};
