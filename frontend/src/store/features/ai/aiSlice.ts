import { createSlice } from "@reduxjs/toolkit";

interface chatType {
    role:string,
    message:string,
    date:Date | null
}

interface initialStateType {
  chats: { role: string; message: string }[];
  loading:boolean;
  error:string | null
  history: string[];
  quickPrompts: chatType[];
}

const initialState: initialStateType = {
    chats: [],
    loading: false,
    error:null,
    history:[],
    quickPrompts:[{
        role:"user",
        message:"Analyze my expenses",
        date: new Date() 
    },{
        role:"user",
        message:"Write today's journal",
        date:new Date()
    },{
        role:"user",
        message:"Plan my tasks",
        date:new Date()
    },{
        role:"user",
        message:"Study tips",
        date:new Date()
    },{
        role:"user",
        message:"Summerize my day",
        date:new Date()
    }
]

}
export const aiSlice = createSlice({
    name: "ai",
    initialState,
    reducers: {
        addChat: (state, action) => {
            state.chats.push(action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setHistory: (state, action) => {
            state.history = action.payload;
        },
        setQuickPrompts: (state, action) => {
            state.quickPrompts = action.payload;
        }
    }
})

export const { addChat, setLoading, setError, setHistory, setQuickPrompts } = aiSlice.actions;

export default aiSlice.reducer;
