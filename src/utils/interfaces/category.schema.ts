import { Document, Model } from 'mongoose';

export interface ICategory {
    name: string,
    price: number
}

export interface categoryDocument extends ICategory, Document {}

export interface categoryModel extends Model<categoryDocument> {}
