function fixAdminLTE () {
    $.AdminLTE.layout.fix();
}

export const AdminLTE = {
    fix: function () {
        try {
            fixAdminLTE();
        } catch (error) {
            setTimeout(fixAdminLTE, 500);
        }
    }
};