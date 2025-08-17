export interface Room {
  id: string // room id. e.g.) 1A8FG3
  title: string // title of the room
  ownerId: string // socket id of the owner
  current: number // current second of playing song
  playlist: [] // list of songs. e.g.) ['youtube:dQw4w9WgXcQ']
}
