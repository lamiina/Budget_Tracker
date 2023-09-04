package com.App.Tracker.Entities;

public enum CatType {
    INCOME("income"),
    EXPENSE("expense"),
    INVESTMENT("investment");

    private final String value;

    CatType(String value){
        this.value = value;
    }
    public String getValue(){
        return value;
    }

    public static CatType[] getAllValues() {
        return CatType.values();
    }
    public static boolean typeExists(String typeToCheck) {
        for (CatType type : CatType.values()) {
            if (type.getValue().equalsIgnoreCase(typeToCheck)) {
                return true;
            }
        }
        return false;
    }

    public static CatType fromValue(String value){
        for(CatType type : CatType.values()){
            if(type.value.equalsIgnoreCase(value)){
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid category type value:" + value);
    }

}
