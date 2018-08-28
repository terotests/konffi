

export interface ServerProject {
  id:string
  full_path : string
  name : string;
}

// file
export interface ServerFile {
  id:string
  path : string,
  full_path : string
  name : string;
  is_file : boolean;
  is_folder : boolean;
  typename : string,
  exttype: string,
  // if folder subfolders
  files? : ServerFile[]
  is_binary? : boolean;
  contents? : string;
  is_read? : boolean;
  cursorPosition? : any;
}

export interface FileContent {
  text : string
}