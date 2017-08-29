import {SimpleSchema} from 'meteor/aldeed:simple-schema';

export const CategorySchema = new SimpleSchema({
    Id: {
        type: String
    },
    Name: {
        type: String
    }
});
export const GuestSchema = new SimpleSchema({
    Name: {
        type: String
    },
    Email: {
        type: String
    }
})
export const TagSchema = new SimpleSchema({
    Id: {
        type: String
    },
    Name: {
        type: String
    }
});

export const OwnerSchema = new SimpleSchema({
    Id: {
        type: String
    },
    FullName: {
        type: String
    }
});