import {Model} from 'radiks';

class Status extends Model {
    static className = 'Status';
    static schema = {
        username: {
            type:String,
            decrypted:true
        },
        text: {
            type:String,
            decrypted: true
        }
    }
};

export default Status;