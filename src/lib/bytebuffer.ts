class ScriptableByteBuffer {

  constructor(private buffer: Java.java.nio.ByteBuffer) {}

  /* Wraps an existing ByteBuffer */
  static wrap(buffer: Java.java.nio.ByteBuffer): ScriptableByteBuffer {
    return new ScriptableByteBuffer(buffer);
  }

  /* Creates a new ByteBuffer */
  static create(): ScriptableByteBuffer {
    let ByteBufferType = Java.type('java.nio.ByteBuffer');
    let buffer = <Java.java.nio.ByteBuffer> new ByteBufferType(); 
    buffer.order(ByteOrder.LITTLE_ENDIAN);
    return new ScriptableByteBuffer(buffer);
  }

  /* byte */
  public put(value: number): ScriptableByteBuffer { this.buffer.put(value); return this; }
  public putIndexed(index: number, value: number): ScriptableByteBuffer { this.buffer.put(index, value); return this; } 
  public get(): number { return this.buffer.get(); }
  public getIndexed(index: number): number { return this.buffer.get(index); }

  /* short */
  public putShort(value: number): ScriptableByteBuffer { this.buffer.putShort(value); return this; }
  public putShortIndexed(index: number, value: number): ScriptableByteBuffer { this.buffer.putShort(index, value); return this; } 
  public getShort(): number { return this.buffer.getShort(); }
  public getShortIndexed(index: number): number { return this.buffer.getShort(index); }

  /* int */
  public putInt(value: number): ScriptableByteBuffer { this.buffer.putInt(value); return this; }
  public putIntIndexed(index: number, value: number): ScriptableByteBuffer { this.buffer.putInt(index, value); return this; } 
  public getInt(): number { return this.buffer.getInt(); }
  public getIntIndexed(index: number): number { return this.buffer.getInt(index); }

  /* long */
  public putLong(value: number): ScriptableByteBuffer { this.buffer.putLong(value); return this; }
  public putLongIndexed(index: number, value: number): ScriptableByteBuffer { this.buffer.putLong(index, value); return this; } 
  public getLong(): number { return this.buffer.getLong(); }
  public getLongIndexed(index: number): number { return this.buffer.getLong(index); }  

  /* boolean */
  public putBool(value: boolean): ScriptableByteBuffer { this.buffer.put(value?1:0); return this; }
  public putBoolIndexed(index: number, value: boolean): ScriptableByteBuffer { this.buffer.put(index, value?1:0); return this; } 
  public getBool(): boolean { return this.buffer.get()==1; }
  public getBoolIndexed(index: number): boolean { return this.buffer.get(index)==1; } 

  /* string */
  public putString(value: string): ScriptableByteBuffer { return this.putBytes(Convert.toBytes(value)); }
  public putStringIndexed(index: number, value: string): ScriptableByteBuffer { return this.putBytesIndexed(index, Convert.toBytes(value)); } 
  public getString(): string { return Convert.toString(this.getBytes()); }
  public getStringIndexed(index: number): string { return Convert.toString(this.getBytesIndexed(index)); }   

  /* byte array */
  public putBytes(value: Array<number>): ScriptableByteBuffer { 
    this.buffer.putShort(value.length); 
    for (let i=0; i<value.length; i++) {
      this.buffer.put(value[i]);
    }
    return this; 
  }
  public putBytesIndexed(index: number, value: Array<number>): ScriptableByteBuffer { 
    this.buffer.putShort(index++, value.length); 
    for (let i=0; i<value.length; i++) {
      this.buffer.put(index++, value[i]);
    }
    return this; 
  } 
  public getBytes(): Array<number> { 
    let length = this.buffer.getShort(), bytes = [];
    for (let i=0; i<length; i++) {
      bytes.push(this.buffer.get());
    }
    return bytes;
  }
  public getBytesIndexed(index: number): Array<number> { 
    let length = this.buffer.getShort(index++), bytes = [];
    for (let i=0; i<length; i++) {
      bytes.push(this.buffer.get(index++));
    }
    return bytes;
  }  
}