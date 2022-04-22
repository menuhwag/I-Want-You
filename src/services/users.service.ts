import { BadRequestException, Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { EmailService } from './email.service';
import { Repository } from 'typeorm';
import { ulid } from 'ulid';
import * as uuid from 'uuid';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
const crypto = require('crypto');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) 
    private userRepository: Repository<UserEntity>,
    private emailService: EmailService,
    private authService: AuthService,
  ){}

  public async create(username: string, email: string, password: string, nickname: string) {
    
    const usernameExists = await this.checkUsernameExists(username);
    if (usernameExists){
      throw new UnprocessableEntityException('아이디 중복')
    }
    
    const emailExists = await this.checkEmailExists(email);
    if (emailExists){
      throw new UnprocessableEntityException('이메일 중복')
    }
    
    const nicnameExists = await this.checkNickExists(nickname);
    if (nicnameExists){
      throw new UnprocessableEntityException('닉네임 중복')
    }

    const verifyToken = uuid.v1();

    await this.saveUser(username, email, password, verifyToken, nickname);
    await this.emailService.sendVerification(email, verifyToken);
    return 'Create User';
  }

  public async verifyEmail(verifyToken: string) {
    const user = await this.userRepository.findOne({where: {verifyToken : verifyToken}});

    if(!user){
      throw new BadRequestException('잘못된 접근입니다');
    }

    user.verifyToken = "";
    user.is_active = true;

    return await this.userRepository.save(user);
  }

  public async login(username: string, password: string){
    // username으로 조회
    const user = await this.userRepository.findOne({where:{username}});
    if (!user){
      throw new UnauthorizedException();
    }
    // password 체크
    if (this.hash(password, user.foo) !== user.password){
      // decoding
      throw new UnauthorizedException();
    }
    if (user.is_active !== true){
      if (user.verifyToken !== ""){
        throw new UnauthorizedException('이메일 인증이 필요합니다');
      }else{
        throw new UnauthorizedException('휴면계정입니다');
      }
    }
    // jwt 발급
    const payload = {
      uuid: user.uuid,
      username: user.username,
      email: user.email
    }
    return await this.authService.login(payload);
  }

  public async findAll(offset: number, limit: number) {
    return await this.userRepository.find();
  }

  public async findOne(id: string) {
    const user = await this.userRepository.findOne({select: ['uuid', 'username', 'email', 'nickname', 'allow_public', 'uuid'], where: {uuid: id}});
    if (user == null){
      throw new NotFoundException('해당 유저가 존재하지 않습니다.');
    }
    return user;
  }

  public async findList(idList: string[]) {
    const option = idList.map((id) => {
      const uuid = {uuid : id};
      return uuid
    })
    console.log(option);
    return await this.userRepository.find({select: ['uuid', 'username', 'email', 'nickname', 'allow_public', 'is_active'], where: option});
  }

  public async update(id: string, updateUserDto: UpdateUserDto) {
    let user = await this.userRepository.findOne({where: {uuid: id}});
    if (!user) {
      throw new NotFoundException();
    }
    for (const key in Object(updateUserDto)) {
      if (key == 'password') {
        user[key] = this.hash(updateUserDto[key] as string, user.foo);
      } else {
        user[key] = updateUserDto[key];
      }
    }
    await this.userRepository.save(user);
    return {
      statusCode: 200,
      message: ['Update Success']
    };
  }

  public async remove(id: string) {
    const user = await this.userRepository.findOne({where: {uuid:id}});
    if (user == null){
      throw new NotFoundException();
    }
    this.userRepository.remove(user);
    return;
  }

  public async checkExists(key: 'id'|'email'|'nickname', value: string){
    let user: UserEntity|null;
    switch (key){
      case ('id'):
        user = await this.userRepository.findOne({where: {username: value}});
        break;
      case ('email'):
        user = await this.userRepository.findOne({where: {email: value}});
        break;
      case ('nickname'):
        user = await this.userRepository.findOne({where: {nickname: value}});
        break;
      default:
        throw new BadRequestException();
    }
    return user == null;
  }

  private async saveUser(username: string, email: string, password: string, verifyToken: string, nickname: string){
    const user = new UserEntity();
    user.uuid = ulid();
    user.username = username;
    user.email = email;
    user.foo = this.generateSalt();
    user.password = this.hash(password, user.foo);
    user.verifyToken = verifyToken;
    user.nickname = nickname;
    user.allow_public = true;
    user.is_active = false;
    user.role = 'USER';
    await this.userRepository.save(user);
  }

  private async checkUsernameExists(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({where: {username: username}});
    return user !== null;
  }
  private async checkEmailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({where: {email: email}});
    return user !== null;
  }
  private async checkNickExists(nickname: string): Promise<boolean> {
    const user = await this.userRepository.findOne({where: {nickname: nickname}});
    return user !== null;
  }
  private generateSalt(){
    return crypto.randomBytes(64).toString('base64');
  }
  private hash(password: string, salt: string){
    const hashed = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
    return hashed;
  }

  async test(){
    return await this.findList(['01G0MD1DSJZSC65C9MWRDN35AJ', '01G0NG6NHN60R2W8VBENE2YWVJ']);
  }
}
