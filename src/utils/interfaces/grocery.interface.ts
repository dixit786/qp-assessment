import { Schema } from 'mongoose';
import { Document, Model } from 'mongoose';

export interface IGrocery {
    name: string,
    price: number,
    category: Schema.Types.ObjectId | string;
}

export interface groceryDocument extends IGrocery, Document {}

export interface groceryModel extends Model<groceryDocument> {}
