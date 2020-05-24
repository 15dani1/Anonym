import {Model} from 'radiks';
import PostObj from './Post'

class Contestation extends Model {
    static className = 'Contestation';

    static DIRECTION_TAKE_DOWN = 0;
    static DIRECTION_KEEP = 1;

    static STATUS_PENDING = 0;
    static STATUS_COMPLETED = 1;

    static schema = {
        post_id: {
            type: String,
            decrypted: true,
            required: true
        },
        amount: {
            type: Number,
            decrypted: true,
            required: true
        },
        direction: {
            type: Number,
            decrypted: true,
            required: true
        },
        wallet_address: {
            type: String,
            decrypted: true,
            required: true
        },
        status: {
            type: Number,
            decrypted: true,
        }
    }

    static defaults = {
        status: this.STATUS_PENDING
    }

    async afterFetch() {
        this.post = await PostObj.findById(this.attrs.post_id)
    }
};

export default Contestation;