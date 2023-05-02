<template>
  <base-popup
    :is-show-footer="true"
    class="popup-add-product"
    name="popup-add-product"
    width="1200px"
    @close="handleClose"
    @open="handleOpen"
  >
    <template #title>Add New Product</template>
    <div class="content pb-6">
      <div class="mb-6">
        <el-form class="flex" label-position="top">
          <div class="left flex-[0.6]">
            <div class="flex justify-between">
              <el-form-item class="flex-1" label="Category">
                <el-select v-model="form.status" :teleported="false" class="w-full" clearable placeholder="Choose category">
                  <el-option v-for="(type, index) in listStatus" :key="index" :label="type.title" :value="type.value" />
                </el-select>
              </el-form-item>
            </div>
            <div class="flex justify-between">
              <el-form-item class="flex-1" label="Product Name">
                <el-input v-model="form.fromAmount" placeholder="e. g. 'Redeemable T-Shirt with logo'"></el-input>
              </el-form-item>
            </div>
            <div class="flex justify-between">
              <el-form-item class="flex-1" label="Short Description">
                <el-input v-model="form.shortDescription" :rows="4" placeholder="e. g. '...'" type="textarea"></el-input>
              </el-form-item>
            </div>
            <div class="wrap-editor mb-6">
              <div class="">Description</div>
              <jodit-editor v-model="form.description" :config="config" />
            </div>

            <!--            <div class="flex justify-between">-->
            <!--              <el-form-item class="flex-1" label="Manufacturer Brand">-->
            <!--                <el-input v-model="form.manufacturerBrand" placeholder="Enter Manufacturer Brand"></el-input>-->
            <!--              </el-form-item>-->
            <!--            </div>-->
            <div class="flex justify-between">
              <el-form-item class="mr-10 flex-1" label="Price">
                <el-input v-model="form.price" placeholder="Enter Price">
                  <template #prefix>
                    <span class="flex h-full items-center text-base text-[#0a0b0d]">$</span>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item class="flex-1" label="Discount">
                <el-input v-model="form.discount" placeholder="Enter discount">
                  <template #prefix>
                    <span class="flex h-full items-center text-base text-[#0a0b0d]">%</span>
                  </template>
                </el-input>
              </el-form-item>
            </div>
            <div class="flex justify-between">
              <el-form-item class="mr-10 flex-1" label="Stock">
                <el-input v-model="form.quantity" placeholder="Enter quantity"></el-input>
              </el-form-item>
              <el-form-item class="flex-1" label="Warranty">
                <el-input v-model="form.warranty" placeholder="Enter warranty period"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="right ml-6 flex-[0.4]">
            <el-form-item class="w-full" label="Product Image">
              <el-upload
                :before-upload="beforeAvatarUpload"
                :on-success="handleAvatarSuccess"
                :show-file-list="false"
                accept=".jpg, .jpeg, .png, .gif"
                action=""
                class="avatar-uploader w-full"
                drag
              >
                <el-icon class="el-icon--upload">
                  <upload-filled />
                </el-icon>
                <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
                <template #tip>
                  <div class="el-upload__tip">PNG, JPG, JPEG, GIF files with a size less than 500kb</div>
                </template>
              </el-upload>
            </el-form-item>
            <el-form-item class="w-full" label="Product Gallery">
              <el-upload
                :before-upload="beforeAvatarUpload"
                :on-success="handleAvatarSuccess"
                :show-file-list="false"
                accept=".jpg, .jpeg, .png, .gif"
                action=""
                class="avatar-uploader w-full"
                drag
              >
                <el-icon class="el-icon--upload">
                  <upload-filled />
                </el-icon>
                <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
                <template #tip>
                  <div class="el-upload__tip">PNG, JPG, JPEG, GIF files with a size less than 500kb</div>
                </template>
              </el-upload>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </base-popup>
</template>

<script lang="ts" setup>
  import { useBaseStore } from '@/stores/base'
  import 'jodit/build/jodit.min.css'
  import { JoditEditor } from 'jodit-vue'
  import { ElMessage } from 'element-plus'
  import type { UploadProps } from 'element-plus'
  import { UploadFilled } from '@element-plus/icons-vue'

  const baseStore = useBaseStore()

  const form: Ref<Record<string, any>> = ref({
    status: '',
    fromDate: '',
    toDate: '',
    price: '',
    discount: '',
    orderBy: '1',
    keywordString: '',
    description: '',
    manufacturerBrand: '',
    quantity: '',
    warranty: '',
    shortDescription: ''
  })
  const listStatus: Ref<Record<string, any>> = ref([
    {
      title: 'Pending',
      value: 'PENDING'
    },
    {
      title: 'Rejected',
      value: 'REJECTED'
    }
  ])
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
        'Type something': 'Type something...'
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

  const imageUrl = ref('')

  const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
    imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  }

  const beforeAvatarUpload: UploadProps['beforeUpload'] = rawFile => {
    if (rawFile.type !== 'image/jpeg') {
      ElMessage.error('Avatar picture must be JPG format!')
      return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
      ElMessage.error('Avatar picture size can not exceed 2MB!')
      return false
    }
    return true
  }
  const handleOpen = () => {
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
