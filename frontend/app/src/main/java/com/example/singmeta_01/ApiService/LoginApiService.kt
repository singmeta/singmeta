package com.example.singmeta_01.ApiService

import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.POST

interface LoginApiService {

    @FormUrlEncoded
    @POST("/user/register")
    fun postRegisterInfoFunc(@Field("name" ) name: String,
                         @Field("email" ) email: String,
                         @Field("phone" ) phone: String,
                         @Field("password" ) password: String,
                         @Field("nickname" ) nickname: String)
            : Call<ResponseBody>

    @FormUrlEncoded
    @POST("/user/login")
    fun postLoginInfoFunc(
                          @Field("email" ) email: String,
                          @Field("password" ) password: String,
                       )
            : Call<ResponseBody>

}