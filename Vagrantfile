# encoding: utf-8
# This file originally created at http://rove.io/97339de35b9dc8aeb40b03c547e2b91e

# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  # config.vm.box = "opscode-ubuntu-12.04_chef-11.4.0"
  # config.vm.box_url = "https://opscode-vm-bento.s3.amazonaws.com/vagrant/opscode_ubuntu-12.04_chef-11.4.0.box"
  config.vm.box = "bento/ubuntu-15.10"
  config.ssh.forward_agent = true

  config.vm.network :forwarded_port, guest: 80, host: 8080
  config.vm.network "private_network", ip: "192.168.10.10"

  # We may just remove this chef provision altogether since I really only
  #  wanted it to install node and postgresql, but it turns out to be better
  #  installing them via apt-get anyhow. Go figure.
  config.vm.provision :chef_solo do |chef|
    chef.cookbooks_path = ["cookbooks"]
    chef.add_recipe :apt
    chef.add_recipe 'vim'
    # chef.add_recipe 'nodejs'
    # chef.add_recipe 'postgresql::server'
    # chef.json = {
    #   :postgresql => {
    #     :config   => {
    #       :listen_addresses => "*",
    #       :port             => "5432"
    #     },
    #     :pg_hba   => [
    #       {
    #         :type   => "local",
    #         :db     => "postgres",
    #         :user   => "postgres",
    #         :addr   => nil,
    #         :method => "trust"
    #       },
    #       {
    #         :type   => "host",
    #         :db     => "all",
    #         :user   => "all",
    #         :addr   => "0.0.0.0/0",
    #         :method => "md5"
    #       },
    #       {
    #         :type   => "host",
    #         :db     => "all",
    #         :user   => "all",
    #         :addr   => "::1/0",
    #         :method => "md5"
    #       }
    #     ],
    #     :password => {
    #       :postgres => "password"
    #     }
    #   }
    # }
  end

  # Install PostgreSQL
  config.vm.provision "shell", inline: <<-SHELL
    # Install posgresql
    sudo apt-get install -y postgresql postgresql-contrib postgresql-client pgadmin3
    # Create the postgres cluster
    sudo pg_createcluster 9.3 main --start
    # Start the server
    sudo /etc/init.d/postgresql start

    # Create the db...would be better not hardcoded, but...
    sudo -u postgres createdb feathersAuthBug

    # Change postgres's password to so we can connect to it in a moment
    # I had to put the command in a new file so it would run properly; it was
    #  being interpreted as (multiple) arguments of the psql command.
    cd /vagrant
    sudo -u postgres psql -f ./postgres-password
  SHELL

  # Install Node JS
  config.vm.provision "shell", :privileged => false, inline: <<-SHELL
    # Install Node JS
    sudo apt-get install -y nodejs npm

    # Install nvm so we can update it node
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.4/install.sh | bash
    # And allow immediate access
    export NVM_DIR="/home/vagrant/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

    # Finally, update to Node JS 6
    nvm install 6
    # Now `node` = Node JS v6.3.1 (until it updates) and `nodejs` = Node JS v0.10.25

    # Install nodemon for automagic server restarting
    npm install -g nodemon

    # Install sequelize-cli for migrations
    npm install -g sequelize-cli
  SHELL

# Ideally, we'd enter it into the startup scripts inside the box, but...
# config.vm.provision :shell, :privileged => false, :path => "startup.sh", :run => 'always'

end
