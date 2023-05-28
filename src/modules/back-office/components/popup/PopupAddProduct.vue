<template>
  <base-popup
    :is-show-footer="true"
    class="popup-add-product"
    name="popup-add-product"
    width="1200px"
    @close="handleClose"
    @open="handleOpen"
  >
    <template #title>Thêm mới sản phẩm</template>
    <div class="content pb-6">
      <div class="mb-6">
        <el-form class="flex" label-position="top">
          <div class="left flex-[0.6]">
            <h1 class="mb-4 text-xl font-bold">Thông tin chung</h1>
            <div class="flex justify-between">
              <el-form-item class="flex-1" label="Danh mục sản phẩm">
                <el-select v-model="form.categoryId" :teleported="false" class="w-full" clearable placeholder="Chọn danh mục">
                  <el-option v-for="(item, index) in listCategory" :key="index" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
            </div>
            <div class="flex justify-between">
              <el-form-item class="flex-1" label="Tên sản phẩm">
                <el-input v-model="form.name" placeholder="VD: 'Laptop Asus Zenbook...'"></el-input>
              </el-form-item>
            </div>
            <!--            <div class="flex justify-between">-->
            <!--              <el-form-item class="flex-1" label="Mô tả ngắn sản phẩm">-->
            <!--                <el-input v-model="form.shortDescription" :rows="4" placeholder="Nhập mô tả sản phẩm" type="textarea"></el-input>-->
            <!--              </el-form-item>-->
            <!--            </div>-->
            <div class="wrap-editor mb-6">
              <div class="">Mô tả chi tiết sản phẩm</div>
              <jodit-editor v-model="form.description" :config="config" />
            </div>

            <!--            <div class="flex justify-between">-->
            <!--              <el-form-item class="flex-1" label="Manufacturer Brand">-->
            <!--                <el-input v-model="form.manufacturerBrand" placeholder="Enter Manufacturer Brand"></el-input>-->
            <!--              </el-form-item>-->
            <!--            </div>-->
            <el-form-item class="w-full" label="Ảnh sản phẩm">
              <!--              <el-upload-->
              <!--                v-model:file-list="fileList"-->
              <!--                :before-upload="beforeAvatarUpload"-->
              <!--                :on-preview="handlePreview"-->
              <!--                :on-remove="handleRemove"-->
              <!--                :on-success="handleAvatarSuccess"-->
              <!--                :show-file-list="true"-->
              <!--                accept=".jpg, .jpeg, .png, .gif"-->
              <!--                action=""-->
              <!--                class="avatar-uploader w-full"-->
              <!--                drag-->
              <!--                list-type="picture-card"-->
              <!--                multiple-->
              <!--              >-->
              <!--                <el-icon class="el-icon&#45;&#45;upload">-->
              <!--                  <upload-filled />-->
              <!--                </el-icon>-->
              <!--                <div class="el-upload__text">Kéo file ảnh vào đây hoặc <em>nhấn để tải lên</em></div>-->
              <!--                <template #tip>-->
              <!--                  <div class="el-upload__tip">PNG, JPG, JPEG, GIF files với kích thước nhỏ hơn 2MB</div>-->
              <!--                </template>-->
              <!--              </el-upload>-->
              <el-upload
                ref="uploadImage"
                v-model:file-list="fileList"
                :auto-upload="false"
                :on-change="handleUploadImage"
                action="#"
                list-type="picture-card"
                multiple
              >
                <el-icon>
                  <Plus />
                </el-icon>

                <template #file="{ file }">
                  <div>
                    <img :src="file.url" alt="" class="el-upload-list__item-thumbnail" />
                    <span class="el-upload-list__item-actions">
                      <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                        <el-icon><Delete /></el-icon>
                      </span>
                    </span>
                  </div>
                </template>
              </el-upload>
            </el-form-item>
            <div class="flex justify-between">
              <el-form-item class="mr-10 flex-1" label="Giá bán">
                <el-input v-model="form.retailPrice" placeholder="Nhập giá bán">
                  <template #prefix>
                    <span class="flex h-full items-center text-base text-[#0a0b0d]">$</span>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item class="flex-1" label="Giá bán khuyến mãi">
                <el-input v-model="form.latestPrice" placeholder="Nhập giá khuyến mãi">
                  <template #prefix>
                    <span class="flex h-full items-center text-base text-[#0a0b0d]">$</span>
                  </template>
                </el-input>
              </el-form-item>
            </div>
            <div class="flex justify-between">
              <el-form-item class="mr-10 flex-1" label="Số lượng" prop="quantity">
                <el-input v-model="form.quantity" placeholder="Nhập số lượng" type="number"></el-input>
              </el-form-item>
              <el-form-item class="flex-1" label="Bảo hành" prop="warranty">
                <el-input v-model="form.warranty" placeholder="Nhập thời gian bảo hành" type="number"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="right ml-6 flex-[0.4]">
            <h1 class="mb-4 text-xl font-bold">Thông tin thuộc tính</h1>
            <div v-if="form.categoryId === 1">
              <FormLaptopAttribute @form-attribute="handleFormAttribute" />
            </div>
          </div>
          <!--          <input multiple type="file" @change="handleFileUpload" />-->
        </el-form>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end">
        <base-button class="mr-4" type="plain">Quay lại</base-button>
        <base-button type="primary" @click="handleCreateProduct"> Thêm mới</base-button>
      </div>
    </template>
  </base-popup>
</template>

<script lang="ts" setup>
  import { useBaseStore } from '@/stores/base'
  import 'jodit/build/jodit.min.css'
  import { JoditEditor } from 'jodit-vue'
  import { Delete, Plus } from '@element-plus/icons-vue'
  import type { ICategory } from '@/interfaces'
  import FormLaptopAttribute from '@/modules/back-office/components/form-model-attribute/FormLaptopAttribute.vue'
  import type { UploadFile, UploadProps, UploadUserFile } from 'element-plus'
  import { apiProduct } from '@/services'

  const baseStore = useBaseStore()

  const disabled = ref(false)
  const uploadImage = ref(null)
  const fileList = ref<Record<string, any>>([])
  const form: Ref<Record<string, any>> = ref({
    categoryId: 1,
    name: '',
    imageList: [],
    description: '',
    //shortDescription
    // shortDescription: null,
    retailPrice: '',
    latestPrice: '',
    quantity: 0,
    featured: 1,
    warranty: 0
  })
  const listCategory: Ref<ICategory[]> = ref([])
  const config: Ref<Record<string, any>> = ref({
    spellcheck: false,
    showCharsCounter: false,
    showWordsCounter: false,
    autofocus: false,
    showXPathInStatusbar: false,
    language: 'en',
    minHeight: 180,
    removeButtons: ['about', 'print', 'selectall', 'video', 'file', 'preview', 'copyformat'],
    i18n: {
      vi: {
        'Type something': 'Nhập mô tả',
        'Search for': 'Nhập tìm kiếm',
        'Open in new tab': 'Mở tab mới',
        'No follow': 'Theo dõi liên kết',
        Insert: 'Thêm',
        Text: 'Tiêu đề',
        Upload: 'Tải lên',
        'Drop image': 'Kéo thả ảnh',
        'or click': 'hoặc chọn từ máy tính',
        'Alternative text': 'Văn bản thay thế'
        // URL: 'Liên kết'
      },
      en: {
        'Type something': 'Nhập mô tả...'
      }
    },
    uploader: {
      url: ``,
      prepareData: function (formdata) {
        formdata.append('type', 'DESCRIPTION_PRODUCT')
        formdata.append('userId', 1)
      },
      format: 'json',
      headers: {
        Authorization: `Bearer `
      },
      isSuccess: function (resp: Record<string, any>): any {
        return !resp.error
      },
      getMessage: function (resp: Record<string, any>): string {
        return resp.msg
      },
      filesVariableName: function (e: any): string {
        return 'files'
      },
      process: function (resp: Record<string, any>): Record<string, any> {
        return {
          files: resp.data || []
        }
      },
      defaultHandlerSuccess: function (data: Record<string, any>): void {
        const field = 'files'

        if (data[field] && data[field]['success'].length) {
          for (let i = 0; i < data[field]['success'].length; i += 1) {
            //@ts-ignore
            this.s.insertImage(data[field]['success'][i].url)
          }
        }
      },
      error: function (e: any): void {
        console.error(e)
      }
    }
  })

  const handleUploadImage: UploadProps['onChange'] = async (uploadFile, uploadFiles) => {
    console.log(uploadFile.raw)
    console.log(uploadFiles)
    if (uploadFile.raw?.type === 'image/png' || uploadFile.raw?.type === 'image/jpeg' || uploadFile.raw?.type === 'image/jpg') {
      const formData = new FormData()
      formData.append('file', uploadFile.raw)
      formData.append('upload_preset', 'u3vef5jg')
      try {
        const result = await apiProduct.uploadImage(formData)
        form.value.imageList.push(result.url)
      } catch (error) {
        console.log('error', error)
      }
    }
  }

  const handleFormAttribute = (payload: Record<string, any>): void => {
    console.log(payload)
    form.value = {
      ...form.value,
      ...payload
    }
    console.log(form.value)
  }

  // const handleFileUpload = event => {
  //   const files = event.target.files
  //   console.log(files)
  //   const formData = new FormData()
  //
  //   for (let i = 0; i < files.length; i++) {
  //     formData.append('file', files[i])
  //   }
  //
  //   formData.append('upload_preset', 'your_upload_preset') // Replace with your Cloudinary upload preset
  //
  //   // Make the API request to upload the files
  // }

  const handleRemove = (file: UploadFile) => {
    //@ts-ignore
    uploadImage.value.handleRemove(file)
  }

  const handleCreateProduct = async (): Promise<void> => {
    try {
      await apiProduct.createProduct({
        ...form.value,
        quantity: +form.value.quantity,
        retailPrice: +form.value.retailPrice,
        latestPrice: +form.value.latestPrice,
        warranty: +form.value.warranty
      })
    } catch (e) {
      console.log(e)
    }
  }

  const handleOpen = () => {
    listCategory.value = [...baseStore.listAssetCategory]
    //
  }
  const handleClose = () => {
    baseStore.setOpenPopup(false, 'popup-add-product')
  }
</script>

<style lang="scss" scoped>
  .avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
<style>
  .avatar-uploader .el-upload {
    /*border: 1px dashed var(--el-border-color);*/
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
</style>
