const db = require('./../utils/db');

/**
 * Member Model Definition
 */
module.exports = class Member {

    static tableName = 'users-table';

    constructor(email, firstName, middleInitial, lastName, phoneNumber, gender) {
        this.email = email;
        this.firstName = firstName;
        this.middleInitial = middleInitial;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.gender = gender;
    }

    async save() {
        await db.put({
            TableName: Member.tableName,
            Item: { ...this },
        }).promise();
    }

    async delete() {
        await db.delete({
            TableName: Member.tableName,
            Key: { email: this.email },
        }).promise();
    }

    // static methods
    static fromMap(params){
        return Object.assign(new this,params);
    }
    
    static async getByEmail(email) {

        const params = {
            TableName: this.tableName,
            Key: {
                email,
            }
        };

        const memberData = await db.get(params).promise();
        return memberData?.Item ? Object.assign(new this, memberData?.Item) : null;

    }

    static async getAll() {

        let params = { TableName: this.tableName };

        let scanResults = [];
        let items;

        do {
            items = await db.scan(params).promise();
            items.Items.forEach((item) => scanResults.push( Object.assign(new this, item)));
            params.ExclusiveStartKey = items.LastEvaluatedKey;
        } while (typeof items.LastEvaluatedKey != "undefined");

        return scanResults;
    }

}