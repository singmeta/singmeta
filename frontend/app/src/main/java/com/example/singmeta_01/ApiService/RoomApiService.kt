package com.example.singmeta_01.ApiService

import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.http.*


interface RoomApiService {
//    @GET("/retrofit/get")
//    fun getFunc(@Query("data") data: String?): Call<ResponseBody>

    @FormUrlEncoded
    @POST("/room/createRoom")
    fun postRoomInfoFunc(@Field("themeNum" ) themeNum: Int,
                         @Field("roomName" ) roomName: String,
                         @Field("headCount" ) headCount: Int,
                         @Field("pw_YN" ) pw_YN: String,
                         @Field("pw" ) pw: String)
    : Call<ResponseBody>

//    @FormUrlEncoded
//    @PUT("/retrofit/put/{id}")
//    fun putFunc(@Path("id") id: String?, @Field("data") data: String?): Call<ResponseBody>
//
//    @DELETE("/retrofit/delete/{id}")
//    fun deleteFunc(@Path("id") id: String?): Call<ResponseBody>
}