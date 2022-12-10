use bincode::{serialize, deserialize};
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
struct Profile {
    name: String,
    email: String,
    display_picture_bytes: Vec<u8>,
}

#[no_mangle]
pub extern fn handler(data: *mut u8, len: usize) -> *mut u8 {
    // create a Vec<u8> from the data pointer and length
    let vec = unsafe { Vec::from_raw_parts(data, len, len) };

    // deserialize the Vec<u8> into a MyStruct
    let my_struct: Profile = deserialize(&vec).unwrap();
    println!("{:?}", my_struct);

    // do something with my_struct here
    // ...
    let mut result = Vec::new();

    // serialize the result into a Vec<u8>
    result = serialize(&my_struct).unwrap();
    return result.as_mut_ptr();
}