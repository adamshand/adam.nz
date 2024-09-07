import PocketBase, { RecordService } from 'pocketbase'
export type { AuthModel, ClientResponseError } from 'pocketbase'

// https://github.com/huntabyte/projecthunt/blob/main/apps/web/src/lib/types.d.ts
// import type Record from 'pocketbase'

export interface SeasonsType {
	color: string
	end: number
	name: string
	// font?: string
	start: number
}

export interface SegmentsType {
	color: string
	index: number
}
export interface CommentType {
	actualCreated?: string
	collectionId: string
	collectionName: string
	created: string
	domain: string
	email: string
	homepage?: string
	id: string
	isApproved: boolean
	location: string
	name: string
	text: string
	updated: string
}

export interface PhotoType {
	albums: string[]
	caption: string
	collectionId: string
	collectionName: string
	created: string
	id: string
	isOrganised: boolean
	photo: string
	tags: string[]
	updated: string
}

export interface ImageSets {
	collectionId: string
	collectionName: string
	created: string
	description: string
	id: string
	image: string[]
	updated: string
}

export interface PostType {
	actualCreated?: string
	aside?: string
	author?: string
	category?: string
	collectionId: string
	collectionName: string
	content: string
	created: string
	format: string
	id: string
	location?: string
	photos?: string[]
	status?: string
	tags?: string[]
	title?: string
	type: string
	updated: string
	views: number
}

export interface TeeMillProductsDesignPlacement {
	h: number
	w: number
	x: number
	y: number
}

export interface TeeMillProductsType {
	colours: Record<string, string>
	design_placement: TeeMillProductsDesignPlacement
	item_code: string
	name: string
}

export interface emojivoreType {
	field: string
	html: string
	id: string
	project: string
	text: string
}

export interface User {
	admin: boolean
	avatar: string
	collectionId: string
	collectionName: string
	created: string
	email: string
	emailVisibility: boolean
	id: string
	name: string
	updated: string
	username: string
	verified: boolean
}

// https://github.com/pocketbase/js-sdk?tab=readme-ov-file#specify-typescript-definitions
export interface TypedPocketBase extends PocketBase {
	collection(idOrName: 'adam'): RecordService<PostType>
	collection(idOrName: 'adam_comments'): RecordService<CommentType>
	collection(idOrName: 'image_sets'): RecordService<ImageSets>
	collection(idOrName: 'quotes_public'): RecordService<PostType>
	collection(idOrName: 'users'): RecordService<User>
}
